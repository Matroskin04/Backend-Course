import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../../domain/blogs.entity';
import { BlogModelType } from '../../../domain/blogs.db.types';
import { variablesForReturn } from '../../../../../infrastructure/helpers/functions/variables-for-return.function.helper';
import { QueryBlogInputModel } from '../../../blogger-blogs/api/models/input/query-blog.input.model';
import { BlogPaginationType } from '../../../public-blogs/infrastructure/query.repository/blogs-public.types.query.repository';
import {
  BlogSAOutputType,
  ViewAllBlogsModel,
} from './blogs-sa.types.query.repository';

@Injectable()
export class BlogsSAQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}
  async getAllBlogs(query: QueryBlogInputModel): Promise<ViewAllBlogsModel> {
    const searchNameTerm: string | null = query?.searchNameTerm ?? null;
    const paramsOfElems = await variablesForReturn(query);

    const countAllBlogsSort = await this.BlogModel.countDocuments({
      name: { $regex: searchNameTerm ?? '', $options: 'i' },
    });

    const allBlogsOnPages = await this.BlogModel.find({
      name: { $regex: searchNameTerm ?? '', $options: 'i' },
    })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort);

    return {
      pagesCount: Math.ceil(countAllBlogsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllBlogsSort,
      items: allBlogsOnPages,
    };
  }

  async getBlogById(blogId: ObjectId): Promise<BlogSAOutputType | null> {
    const blog = this.BlogModel.findOne({ _id: blogId }).lean();
    return blog;
  }
}
