import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { Hashing } from "./utils/hashing.util";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async authenticate(
    userId: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (user == null) {
      throw new BadRequestException("User Not Found");
    }

    if (!Hashing.verify(password, user.password)) {
      throw new BadRequestException("Not Authorized");
    }

    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
