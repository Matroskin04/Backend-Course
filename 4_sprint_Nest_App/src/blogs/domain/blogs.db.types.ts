import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { Blog } from './blogs-schema-model';

export type BlogDBType = {
  _id: ObjectId;

  name: string;

  description: string;

  websiteUrl: string;

  createdAt: string;

  isMembership: boolean;
};

export type BlogDTOType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & BlogModelStaticMethodsType;

export type BlogModelStaticMethodsType = {
  createInstance: (
    blogDTO: BlogDTOType,
    BlogModel: BlogModelType,
  ) => BlogDocument;
};