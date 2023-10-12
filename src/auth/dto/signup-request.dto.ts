import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '이름',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '비밀번호',
  })
  @IsNotEmpty()
  password: string;
}
