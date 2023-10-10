import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 403,
    description: '유효하지 않은 이메일 or 비밀번호',
  })
  @UseGuards(LocalAuthGuard)
  async login(@Body() requestDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(requestDto);
  }
}
