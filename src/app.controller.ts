import { Controller, Get, Param, Query, Session } from "@nestjs/common";
import { AppService } from "./app.service";
import { Role } from "@prisma/client";

@Controller("/api/v1/")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/auth/:role")
  async authenticate(
    @Param("role") role: Role,
    @Query("id") userId: string,
    @Query("password") password: string,
    @Session() session: any,
  ) {
    await this.appService.authenticate(userId, password);
    session.userId = userId;
    session.role = role;
  }
}
