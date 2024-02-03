import { IsNotEmpty } from 'class-validator';

export class TagEntity {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  tag: string;
}
