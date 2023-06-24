import {Request, Response} from "express";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {authService} from "../domain/auth-service";
import {RequestWithBody} from "../types/types";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {devicesService} from "../domain/devices-service";
import {
    RegisterConfirmAuthModel,
    RegisterResendConfirmAuthModel,
    RegistrationAuthModel
} from "../models/AuthModels/RegistrationAuthModel";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {jwtService} from "../domain/jwt-service";
import {NewPasswordAuthModel, PasswordRecoveryAuthModel} from "../models/AuthModels/PasswordRecoveryFlowAuthModel";
import {HTTP_STATUS_CODE} from "../helpers/http-status";

export const authController = {

    async getUserInformation(req: Request, res: Response<ViewAuthModel>) {

        const result = await authService.getUserInformation(req.userId!)
        if (result) {
            res.status(HTTP_STATUS_CODE.OK_200).send(result)
        } else {
            res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404)
        }
    },

    async loginUser(req: RequestWithBody<LoginAuthInputModel>,
                    res: Response<ViewTokenModel>) {

        const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);

        if (result) {
            await devicesService.createNewDevice(req.socket.remoteAddress || 'unknown', req.headers['user-agent'] || 'unknown', result.userId, result.refreshToken)
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,});
            res.status(HTTP_STATUS_CODE.OK_200).send({accessToken: result.accessToken});

        } else {
            res.sendStatus(HTTP_STATUS_CODE.UNAUTHORIZED_401);
        }
    },

    async registerUser(req: RequestWithBody<RegistrationAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        await authService.registerUser(req.body.email, req.body.login, req.body.password);
        res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
    },

    async confirmEmail(req: RequestWithBody<RegisterConfirmAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        await authService.confirmEmail(req.userId!);
        res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Email was verified. Account was activated')
    },

    async resendEmailConfirmation(req: RequestWithBody<RegisterResendConfirmAuthModel>,
                                  res: Response<string>) {

        await authService.resendConfirmationEmailMessage(req.userId!, req.body.email);
        res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')
    },

    async newRefreshToken(req: Request, res: Response<string | ViewTokenModel>) {

        const tokens = await jwtService.changeTokensByRefreshToken(req.userId!, req.refreshToken);
        if (!tokens) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).send('Something was wrong');
            return;
        }

        res.cookie(`refreshToken`, tokens.refreshToken, {httpOnly: true, secure: true,})
        res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send({accessToken: tokens.accessToken});
    },

    async logoutUser(req: Request, res: Response<void>) {

        await devicesService.deleteDeviceByRefreshToken(req.refreshToken);
        res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
    },

    async passwordRecovery(req: RequestWithBody<PasswordRecoveryAuthModel>, res: Response<string>) {

        await authService.sendEmailPasswordRecovery(req.body.email);
        res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Email with instruction will be send to passed email address (if a user with such email exists)');
    },
    
    async saveNewPassword(req: RequestWithBody<NewPasswordAuthModel>, res: Response<string | ViewAllErrorsModels>) {

        const result = await authService.saveNewPassword(req.body.newPassword, req.body.recoveryCode);
        result === true ? res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('New password is saved')
            : res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).send(result)
    }
}