import {ObjectId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";
import {
    BlogTypeWithId,
    BodyBlogType
} from "../../infrastructure/repositories/repositories-types/blogs-types-repositories";


export type BlogDBType = {

    _id: ObjectId

    name: string

    description: string

    websiteUrl: string

    createdAt: string

    isMembership: boolean
}

export type HydratedBlogType = HydratedDocument<BlogDBType, BlogDBInstanceMethodsType>;

export type BlogDBInstanceMethodsType = {
    renameIntoViewModel: () => BlogTypeWithId;
    updateBlogInfo: (updateData: BodyBlogType) => void
};

export type BlogDBStaticMethodsType = {
    makeInstance: (name: string, description: string, websiteUrl: string, isMembership?: boolean) => HydratedBlogType;
};


export type BlogDBFullType = Model<BlogDBType, {}, BlogDBInstanceMethodsType> & BlogDBStaticMethodsType;
