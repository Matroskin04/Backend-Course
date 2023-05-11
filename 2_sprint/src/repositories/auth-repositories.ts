import {refreshTokensCollection} from "../db";
import {refreshTokensDBType} from "../types/types";

export const authRepositories = {

    async deactivateRefreshToken(refreshObject: refreshTokensDBType): Promise<void> { // todo нужно такую функцию заварачивать в try catch
        await refreshTokensCollection.insertOne(refreshObject)
        return;
    }
}