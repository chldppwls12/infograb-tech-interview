import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthRepository } from '../repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { ErrMessage } from '../../common/enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from '../dto/token-response.dto';
import { TokenPayloadDto } from '../dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signTokens(payload: TokenPayloadDto): Promise<TokenResponseDto> {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      }),
    };
  }
  async login(requestDto: LoginRequestDto): Promise<TokenResponseDto> {
    const { email } = requestDto;
    const userId = await this.authRepository.findUserPk(email);
    if (!userId) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL_OR_PASSWORD);
    }

    return this.signTokens({ email, userId });
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

  async reissueTokens(): Promise<TokenResponseDto> {
    // TODO: redis에서 userId 뽑기
    const userId = 'test';
    if (!userId) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    return this.signTokens({
      userId,
      email: await this.authRepository.findUserEmailById(userId),
    });
  }
}
