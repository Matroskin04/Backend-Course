import {
  PostPaginationType,
  PostViewType,
} from './posts-types-query-repository';
import { ObjectId } from 'mongodb';
import { QueryPostModel } from '../../api/models/QueryPostModel';
import { variablesForReturn } from '../../../../infrastructure/queryRepositories/utils/variables-for-return';
import { QueryBlogModel } from '../../../blogs/api/models/QueryBlogModel';
import { PostsOfBlogPaginationType } from '../../../blogs/infrastructure/query.repository/blogs-types-query-repository';
import {
  modifyPostForAllDocs,
  modifyPostIntoViewModel,
} from '../../../../infrastructure/helpers/functions/posts-functions-helpers';
import { StatusOfLike } from '../../../comments/infrastructure/query.repository/comments-types-query-repository';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query.repository/blogs-query-repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/posts-schema-model';
import { PostModelType } from '../../domain/posts-db-types';
import { LikesInfoQueryRepository } from '../../../../infrastructure/general-features/likes.info/infrastructure/query.repository/likes-info-query-repository';
import { reformNewestLikes } from '../../../../infrastructure/queryRepositories/utils/likes-info-functions';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    protected likesInfoQueryRepository: LikesInfoQueryRepository,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  async getAllPosts(
    query: QueryPostModel,
    userId: ObjectId | null,
  ): Promise<PostPaginationType> {
    const searchNameTerm: string | null = query?.searchNameTerm ?? null;
    const paramsOfElems = await variablesForReturn(query);

    const countAllPostsSort = await this.PostModel.countDocuments({
      title: { $regex: searchNameTerm ?? '', $options: 'i' },
    });

    const allPostsOnPages = await this.PostModel.find({
      title: { $regex: searchNameTerm ?? '', $options: 'i' },
    })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort)
      .lean();

    const allPosts = await Promise.all(
      allPostsOnPages.map(async (p) =>
        modifyPostForAllDocs(p, userId, this.likesInfoQueryRepository),
      ), //todo Передаю репозиторий!!??
    );

    return {
      pagesCount: Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllPostsSort,
      items: allPosts,
    };
  }

  async getPostsOfBlog(
    blogId: string,
    query: QueryBlogModel,
    userId: ObjectId | null,
  ): Promise<null | PostsOfBlogPaginationType> {
    //Проверка есть ли блог
    const blog = await this.blogQueryRepository.getBlogById(blogId);
    if (!blog) {
      return null;
    }

    const paramsOfElems = await variablesForReturn(query);
    const countAllPostsSort = await this.PostModel.countDocuments({
      blogId: blogId,
    });

    const allPostsOnPages = await this.PostModel.find({ blogId: blogId })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort)
      .lean();

    if (allPostsOnPages.length === 0) return null;

    const allPostsOfBlog = await Promise.all(
      allPostsOnPages.map(async (p) =>
        modifyPostForAllDocs(p, userId, this.likesInfoQueryRepository),
      ), //2 parameter = userId
    );

    return {
      pagesCount: Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllPostsSort,
      items: allPostsOfBlog,
    };
  }

  async getPostById(
    postId: ObjectId,
    userId: ObjectId | null,
  ): Promise<null | PostViewType> {
    const post = await this.PostModel.findOne({ _id: postId });
    if (!post) {
      return null;
    }

    //set StatusLike
    let myStatus: StatusOfLike = 'None';

    if (userId) {
      const likeInfo =
        await this.likesInfoQueryRepository.getLikesInfoByPostAndUser(
          new ObjectId(postId),
          userId,
        );

      if (likeInfo) {
        myStatus = likeInfo.statusLike;
      }
    }

    //find last 3 Likes
    const newestLikes =
      await this.likesInfoQueryRepository.getNewestLikesOfPost(
        new ObjectId(postId),
      );
    const reformedNewestLikes = reformNewestLikes(newestLikes);

    return modifyPostIntoViewModel(post, reformedNewestLikes, myStatus);
  }
}
