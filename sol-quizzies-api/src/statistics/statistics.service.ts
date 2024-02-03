import { Get, Injectable, Param } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { GameService } from 'src/games/games.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly gameService: GameService) {}
  create(createStatisticDto: CreateStatisticDto) {
    return 'This action adds a new statistic';
  }

  findAll() {
    return `This action returns all statistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }

  update(id: number, updateStatisticDto: UpdateStatisticDto) {
    return `This action updates a #${id} statistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} statistic`;
  }

  @Get('leaderboard/:gameId')
  async getLeaderboard(@Param('gameId') gameId: string) {
    try {
      // Call the appropriate method from the GameService to get the leaderboard
      const leaderboard = await this.gameService.getLeaderboard(gameId);
      return { leaderboard };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
