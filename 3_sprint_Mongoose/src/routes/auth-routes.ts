import {Router} from "express";
import {
    validateAuthConfirmationCode,
    validateLoginDataAuth,
    validateRegistrationDataAuth,
    validateAuthEmail, validateAuthEmailForPassRecovery, validateAuthNewPassword
} from "../middlewares/validation-middlewares/auth-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {
    validateAccessToken,
    validateRefreshToken
} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateInfoRequest} from "../middlewares/info-request-middlewares/validate-info-request-middleware";
import {saveInfoRequest} from "../middlewares/info-request-middlewares/save-info-request-middleware";
import {authController} from "../controllers/auth-controller";

export const authRoutes = Router();

authRoutes.get('/me',
    validateAccessToken,
    authController.getUserInformation);

authRoutes.post('/login',
    saveInfoRequest,
    validateInfoRequest,
    validateLoginDataAuth,
    getErrors,
    authController.loginUser);

authRoutes.post('/registration',
    saveInfoRequest,
    validateInfoRequest,
    validateRegistrationDataAuth,
    getErrors,
    authController.registerUser);

authRoutes.post('/registration-confirmation',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthConfirmationCode,
    getErrors,
    authController.confirmEmail);

authRoutes.post('/registration-email-resending',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthEmail,
    getErrors,
    authController.resendEmailConfirmation);

authRoutes.post('/refresh-token',
    validateRefreshToken,
    authController.newRefreshToken)

authRoutes.post('/logout',
    validateRefreshToken,
    authController.logoutUser);

authRoutes.post('/password-recovery',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthEmailForPassRecovery,
    getErrors,
    authController.passwordRecovery);

authRoutes.post('/new-password',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthNewPassword,
    getErrors,
    authController.saveNewPassword)