import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthRepository } from '../repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { ErrMessage } from '../../common/enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(requestDto: LoginRequestDto) {
    const { email } = requestDto;
    const userPk = await this.authRepository.findUserPk(email);
    if (!userPk) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }

    // access token, refresh token 설정
    const payload = {
      email,
      userPk,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      }),
    };
  }

  async validateUser(email: string, password: string) {
    // 이메일 확인
    if (!(await this.authRepository.isValidEmail(email))) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }

    // 비밀번호 확인
    const hashedPw = await this.authRepository.findUserHashedPw(email);
    if (!hashedPw) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }
    if (!(await bcrypt.compare(password, hashedPw))) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }

    return true;
  }
}
