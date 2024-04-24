import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { AdminModule } from "./admin/admin.module";
import { HospitalModule } from "./hospital/hospital.module";
import { PatientModule } from "./patient/patient.module";
import { ModelModule } from "./model/model.module";
import { ResearcherModule } from "./researcher/researcher.module";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require("cookie-session");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AdminModule,
    HospitalModule,
    PatientModule,
    ModelModule,
    ResearcherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes("*")
      .apply(
        cookieSession({
          keys: [this.configService.get("COOKIE_KEY")],
        }),
      )
      .forRoutes("*");
  }
}
