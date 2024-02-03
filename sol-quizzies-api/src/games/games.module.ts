import { Module } from '@nestjs/common';
import { GameService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionsService } from 'src/questions/questions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GamesController],
  providers: [GameService, QuestionsService],
  imports: [PrismaModule],
  exports: [GameService],
})
export class GamesModule {}
