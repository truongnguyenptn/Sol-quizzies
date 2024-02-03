import { IsNotEmpty } from 'class-validator';

export class GenQuestionDto {
  @IsNotEmpty()
  readonly amount: string;

  @IsNotEmpty()
  readonly topic: string;

  @IsNotEmpty()
  readonly type: string;
}
