import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";

export class AuthGuard implements CanActivate {
  private jwtService: JwtService = new JwtService();

  constructor(private role: Role) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user: User = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request["user"] = user;

      return user.userId && user.role === this.role;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
