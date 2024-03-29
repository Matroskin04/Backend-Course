import {usersCollection} from "../db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../types/types";

export const usersRepository = {

    async createUser(bodyUser: UserDBType): Promise<void> {

        await usersCollection.insertOne(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await usersCollection.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount > 0;
    },

    async updateConfirmation(id: ObjectId): Promise<void> {

        await usersCollection.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return;
    },

    async updateCodeConfirmation(_id: ObjectId, newCode: string): Promise<boolean> {

        const result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.modifiedCount > 0;
    }
}