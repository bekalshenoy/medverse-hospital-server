import { Module } from "@nestjs/common";
import { ResearcherService } from "./researcher.service";
import { ResearcherController } from "./researcher.controller";

@Module({
  providers: [ResearcherService],
  controllers: [ResearcherController],
})
export class ResearcherModule {}
