import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Role } from "@prisma/client";

export class AuthGuard implements CanActivate {
  constructor(private role: Role) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId && this.role === request.session.role;
  }
}
