import { QueryBlogInputModel } from './models/input/query-blog.input.model';
import {
  ViewAllBlogsModel,
  BlogOutputModel,
  ViewPostsOfBlogModel,
} from './models/output/blog.output.model';
import { CreateBlogInputModel } from './models/input/create-blog.input.model';
import { UpdateBlogInputModel } from './models/input/update-blog.input.model';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAccessGuard } from '../../../../infrastructure/guards/jwt-access.guard';
import { HTTP_STATUS_CODE } from '../../../../infrastructure/helpers/enums/http-status';
import { PostsQueryRepository } from '../../../posts/infrastructure/query.repository/posts.query.repository';
import { PostsService } from '../../../posts/application/posts.service';
import { BlogsBloggerQueryRepository } from '../infrastructure/query.repository/blogs-blogger.query.repository';
import { BlogsBloggerService } from '../application/blogs-blogger.service';
import { CurrentUserId } from '../../../../infrastructure/decorators/auth/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { CreatePostByBlogIdModel } from '../../../posts/api/models/input/create-post.input.model';
import { PostTypeWithId } from '../../../posts/infrastructure/repository/posts.types.repositories';
import { BlogOwnerByIdGuard } from '../../../../infrastructure/guards/blog-owner-by-id.guard';
import { UpdatePostByBlogIdInputModel } from './models/input/update-post-by-blog-id.input.model';

@SkipThrottle()
@Controller('/hometask-nest/blogger/blogs')
export class BlogsBloggerController {
  constructor(
    protected blogsBloggerQueryRepository: BlogsBloggerQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsBloggerService: BlogsBloggerService,
    protected postsService: PostsService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  async getAllBlogs(
    @Query() query: QueryBlogInputModel,
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewAllBlogsModel>,
  ) {
    //todo попробовать получить не объектом
    const result = await this.blogsBloggerQueryRepository.getAllBlogs(
      query,
      userId,
    );
    res.status(HTTP_STATUS_CODE.OK_200).send(result);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Get(':blogId/posts')
  async getAllPostsOfBlog(
    @Param('blogId') blogId: string,
    @CurrentUserId() userId: ObjectId,
    @Query() query: QueryBlogInputModel,
    @Res() res: Response<ViewPostsOfBlogModel>,
  ) {
    const result = await this.postsQueryRepository.getPostsOfBlog(
      blogId,
      query,
      userId,
    );
    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  async createBlog(
    @Body() inputBlogModel: CreateBlogInputModel,
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<BlogOutputModel>,
  ) {
    const result = await this.blogsBloggerService.createBlog(
      inputBlogModel,
      userId,
    );
    res.status(HTTP_STATUS_CODE.CREATED_201).send(result);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Post(`/:blogId/posts`)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: CreatePostByBlogIdModel,
    @Res() res: Response<PostTypeWithId>,
  ) {
    const result = await this.postsService.createPostByBlogId(
      blogId,
      inputPostModel,
    );
    result
      ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputBlogModel: UpdateBlogInputModel,
    @Res() res: Response<void>,
  ) {
    const result = await this.blogsBloggerService.updateBlog(
      blogId,
      inputBlogModel,
    );
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Put(':blogId/posts/:postId')
  async updatePostOfBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() inputPostModel: UpdatePostByBlogIdInputModel,
    @Res() res: Response<void>,
  ) {
    const result = await this.postsService.updatePostByBlogId(
      blogId,
      postId,
      inputPostModel,
    );

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string, @Res() res: Response<void>) {
    const result = await this.blogsBloggerService.deleteSingleBlog(blogId);
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard, BlogOwnerByIdGuard)
  @Delete(':blogId/posts/:postId')
  async deletePostOfBlog(
    //todo blogId не нужен,?
    @Param('postId') postId: string,
    @Res() res: Response<void>,
  ) {
    const result = await this.postsService.deleteSinglePost(postId);
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }
}