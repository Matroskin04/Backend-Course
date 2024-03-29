import {ResponseTypeService} from "../../service-types/responses-types-service";

export const createResponseService = (statusCode: number, message: any): ResponseTypeService => {
    return {
        status: statusCode,
        message: message
    }
}