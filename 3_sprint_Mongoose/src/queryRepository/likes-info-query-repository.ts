import { injectable } from "inversify";
import {ObjectId} from "mongodb";
import {LikesInfoModel} from "../db/shemasModelsMongoose/likes-info-schema-model";
import {LikesInfoDBType} from "../types/db-types";

@injectable()
export class LikesInfoQueryRepository {

    async getLikesInfoByCommentAndUser(commentId: ObjectId, userId: ObjectId): Promise<LikesInfoDBType | null> {

        return LikesInfoModel.findOne({commentId, userId});
    }
}