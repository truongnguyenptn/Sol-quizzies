import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { GamesModule } from 'src/games/games.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [GamesModule],
})
export class StatisticsModule {}
