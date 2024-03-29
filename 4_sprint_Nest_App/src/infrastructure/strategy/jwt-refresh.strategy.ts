import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersSAQueryRepository } from '../../features/users/super-admin/infrastructure/query.repository/users-sa.query.repository';
import { DevicesQueryRepository } from '../../features/devices/infrastructure/query.repository/devices.query.repository';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    protected usersQueryRepository: UsersSAQueryRepository,
    protected devicesQueryRepository: DevicesQueryRepository,
  ) {
    super({
      jwtFromRequest: JwtRefreshStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: process.env.PRIVATE_KEY_REFRESH_TOKEN,
    });
  }

  async validate(payload: any) {
    const user = this.usersQueryRepository.getUserByUserId(payload.userId);
    if (!user) throw new UnauthorizedException();

    const device = await this.devicesQueryRepository.getDeviceById(
      payload.deviceId,
    );
    if (
      device?.userId !== payload.userId ||
      device?.deviceId !== payload.deviceId ||
      device?.lastActiveDate !== new Date(payload.iat! * 1000).toISOString()
    ) {
      throw new UnauthorizedException();
    }

    return { id: payload.userId };
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
