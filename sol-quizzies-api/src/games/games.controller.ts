import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GameService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitgameDto } from './dto/submit-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly GameService: GameService) {}

  @Post('/create')
  create(@Body() createGameDto: CreateGameDto) {
    return this.GameService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.GameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.GameService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Game not found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.GameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.GameService.remove(+id);
  }

  @Post('start')
  startGame(@Body() startGameDto: StartGameDto) {
    console.log('start');
    const { gameId, userId } = startGameDto;
    return this.GameService.startGame(startGameDto);
  }

  @Post('statistics')
  getDetailedGameStatistics(@Body() startGameDto: StartGameDto) {
    console.log('statistics');
    const { gameId, userId } = startGameDto;
    return this.GameService.getDetailedGameStatistics(gameId, userId);
  }

  @Post('submit')
  submitGame(@Body() submitgameDto: SubmitgameDto) {
    console.log('submit');
    const { gameId, userId } = submitgameDto;
    return this.GameService.submitGame(submitgameDto);
  }
}
