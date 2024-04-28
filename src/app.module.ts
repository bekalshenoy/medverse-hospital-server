import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { AdminModule } from "./admin/admin.module";
import { APP_PIPE } from "@nestjs/core";
import { DoctorModule } from "./doctor/doctor.module";
import { PatientModule } from "./patient/patient.module";
import { EncryptionService } from "./encryption.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../client/dist/browser"),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "2 days" },
    }),
    AdminModule,
    DoctorModule,
    PatientModule,
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
    EncryptionService,
  ],
})
export class AppModule {}
