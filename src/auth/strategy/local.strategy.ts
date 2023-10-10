import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrMessage } from '../../common/enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    if (!(await this.authService.validateUser(email, password))) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }
    return true;
  }
}
