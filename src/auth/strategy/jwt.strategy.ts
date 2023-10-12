import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { CacheService } from '../../cache/service/cache.service';
import { ConfigService } from '@nestjs/config';
import { JWT_BLACKLIST_KEY } from '../../common/constants';
import { ErrMessage } from '../../common/enum';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt-secret',
      passReqToCallback: true,
    });
  }

  // 토큰 유효성 검사 및 payload 반환
  async validate(req: any, payload: TokenPayloadDto): Promise<TokenPayloadDto> {
    const token = req.token;

    // blacklist 확인
    if (await this.cacheService.sismember(JWT_BLACKLIST_KEY, token)) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    return payload;
  }
}
