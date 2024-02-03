import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GenQuestionDto } from './dto/gen-question.dto';
import { GenerateQuestion } from './commands/generateQuestion';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }
  generate(genQuestionDto: GenQuestionDto) {
    return GenerateQuestion.generate(genQuestionDto);
  }
  findAll() {
    return `This action returns all questions`;
  }

  async findOne(gameId: number) {}

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
