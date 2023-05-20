import {devicesCollection} from "../db";
import {DeviceOutputType} from "../repositories/repositories-types/devices-types-repositories";
import {DeviceDBType} from "../types/types";

export const devicesQueryRepository = {

    async getAllDevices(): Promise<DeviceOutputType[]> {

        return await devicesCollection.find({}, {projection: [ {_id: 0}, {userId: 0} ]}).toArray();
    },

    async getDeviceById(deviceId: string): Promise<DeviceDBType | null> {

        return await devicesCollection.findOne({deviceId});
    }
}