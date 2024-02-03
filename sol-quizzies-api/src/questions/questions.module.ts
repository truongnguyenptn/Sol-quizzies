import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, PrismaService],
  imports: [PrismaModule],
  exports: [QuestionsService],
})
export class QuestionsModule {}
