import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  userId: string;

  @IsNumber()
  questionId: string;

  @IsNumber()
  attemptId: string;

  @IsString()
  userInput: string;

  @IsBoolean()
  isCorrect: boolean;
}
