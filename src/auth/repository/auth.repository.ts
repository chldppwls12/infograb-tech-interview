import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

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
}
