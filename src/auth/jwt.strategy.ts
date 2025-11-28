// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // MUST NOT BE undefined → use !
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  validate(payload: { userId: string; email: string }) {
    // return the actual userId from payload
    return { userId: payload.userId, email: payload.email };
  }
}
