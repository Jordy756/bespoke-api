import { PrismaService } from '@core/database/prisma.service';
import { AiOrchestratorService } from '@core/providers/ai-orchestrator.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService, AiOrchestratorService],
  exports: [PrismaService, AiOrchestratorService],
})
export class CoreModule {}
