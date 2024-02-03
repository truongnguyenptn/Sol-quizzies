import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateGameDto } from './create-game.dto';

export class SubmitgameDto extends PartialType(CreateGameDto) {
  @IsNotEmpty()
  readonly gameId: string;
  @IsNotEmpty()
  readonly attemptId: string;
  @IsNotEmpty()
  readonly userId: string;
}
