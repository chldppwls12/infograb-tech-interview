import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from '../dto/token-response.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CurrentUser } from '../decorator/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: '로그인 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '로그인 성공',
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 이메일 or 비밀번호',
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() requestDto: LoginRequestDto): Promise<TokenResponseDto> {
    return this.authService.login(requestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 재발급 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '토큰 재발급 성공',
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async reissueTokens(@CurrentUser() user): Promise<TokenResponseDto> {
    return this.authService.reissueTokens(user);
  }
}
