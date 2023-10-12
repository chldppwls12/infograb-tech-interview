import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup-request.dto';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: SignUpRequestDto): Promise<void> {
    await this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async findUserPk(email: string): Promise<string | null> {
    return (
      await this.prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          email,
          status: Status.NORMAL,
        },
      })
    )?.id;
  }

  async isValidEmail(email: string): Promise<boolean> {
    return !!this.prisma.user.findFirst({
      where: {
        email,
        status: Status.NORMAL,
      },
    });
  }

  async findUserHashedPw(email: string): Promise<string | null> {
    return (
      await this.prisma.user.findFirst({
        select: { password: true },
        where: {
          email,
          status: Status.NORMAL,
        },
      })
    )?.password;
  }

  async findUserEmailById(id: string): Promise<string | null> {
    return (
      await this.prisma.user.findFirst({
        select: { email: true },
        where: {
          id,
          status: Status.NORMAL,
        },
      })
    )?.email;
  }
}
