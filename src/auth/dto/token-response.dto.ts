import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    description: '엑세스 토큰',
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
  })
  @IsNotEmpty()
  refreshToken: string;
}
