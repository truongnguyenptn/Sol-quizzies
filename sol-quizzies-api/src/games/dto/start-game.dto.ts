import { IsNotEmpty } from 'class-validator';

export class StartGameDto {
  @IsNotEmpty()
  readonly gameId: string;
  @IsNotEmpty()
  readonly userId: string;
}
