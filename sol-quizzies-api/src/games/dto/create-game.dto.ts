import { Game_gameType } from '@prisma/client';

export class CreateGameDto {
  topic: string;
  type: Game_gameType;
  amount: string;
}
