import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("/api/v1")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/auth")
  async authenticate(
    @Body() user: { userId: string; password: string },
  ): Promise<{ access_token: string }> {
    return await this.appService.authenticate(user.userId, user.password);
  }
}
