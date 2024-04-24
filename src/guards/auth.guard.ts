import { CanActivate, ExecutionContext } from "@nestjs/common";

export enum Role {
  ROLE_ADMIN,
  ROLE_RESEARCHER,
  ROLE_HOSPITAL,
  ROLE_PATIENT,
  ROLE_MODEL,
}

export class AuthGuard implements CanActivate {
  constructor(private role: Role) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId && this.role === request.session.role;
  }
}
