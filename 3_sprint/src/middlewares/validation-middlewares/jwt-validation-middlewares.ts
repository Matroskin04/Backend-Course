import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/users-service";
import {jwtQueryRepository} from "../../queryRepository/jwt-query-repository";
import {devicesQueryRepository} from "../../queryRepository/devices-query-repository";

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await usersService.getUserIdByAccessToken(token);

    if (userId) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(401)
}

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken || null;
    if (!refreshToken) {
        res.status(401).send('JWT refreshToken inside cookie is missing');
        return;
    }

    const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
    if (!payloadToken) {
        res.status(401).send('JWT refreshToken inside cookie is invalid or expired');
        return;
    }

    const device = await devicesQueryRepository.getDeviceById(payloadToken.deviceId)
    if (device?.userId !== payloadToken.userId
        || device?.deviceId !== payloadToken.deviceId
        || device?.lastActiveDate !== new Date(payloadToken.iat!).toISOString()) {
        res.status(401).send('JWT refreshToken inside cookie is invalid');
        return;
    }

    if (payloadToken.userId) {
        req.userId = payloadToken.userId;
        req.refreshToken = refreshToken;
        next();
    }
}


