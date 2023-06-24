import {ObjectId} from "mongodb";
import {UserDBType} from "../types/types";
import {UserModel} from "../db/shemasModelsMongoose/users-shema-model";

export const usersRepository = {

    async createUser(bodyUser: UserDBType): Promise<void> {

        await UserModel.create(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await UserModel.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount === 1;
    },

    async updateConfirmation(id: ObjectId): Promise<boolean> {

        const result = await UserModel.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },

    async updateCodeConfirmation(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'emailConfirmation.confirmationCode': newCode, 'emailConfirmation.expirationDate': newDate} })
        return result.modifiedCount === 1;
    },

    async updateCodePasswordRecovery(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'passwordRecovery.confirmationCode': newCode, 'passwordRecovery.expirationDate': newDate}})

        return result.modifiedCount === 1;
    },

    async updatePassword(newPasswordHash: string, _id: ObjectId): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {passwordHash: newPasswordHash}}
        )
        return result.modifiedCount === 1;
    }
}