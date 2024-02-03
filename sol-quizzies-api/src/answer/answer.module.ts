import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService],
  imports: [PrismaModule],
})
export class AnswerModule {}
