import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAnswerDto: CreateAnswerDto) {
    const { userId, questionId, attemptId, userInput, isCorrect } =
      createAnswerDto;
    await this.prisma.answer.create({
      data: {
        userId,
        question: {
          connect: {
            id: questionId,
          },
        },
        attempt: {
          connect: {
            id: attemptId,
          },
        },
        userAnswer: userInput,
        isCorrect,
      },
    });
  }

  findAll() {
    return `This action returns all answer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} answer`;
  }

  update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return `This action updates a #${id} answer`;
  }

  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
  async checkAnswerResult(answerDto: CreateAnswerDto): Promise<boolean> {
    try {
      const { questionId, userInput, attemptId, userId } = answerDto;
      const question = await this.prisma.question.findUnique({
        where: { id: questionId },
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      if (question.questionType === 'mcq') {
        const isCorrect =
          question.answer.toLowerCase().trim() ===
          userInput.toLowerCase().trim();

        await this.create({
          userId,
          questionId,
          attemptId,
          userInput,
          isCorrect,
        });

        return isCorrect;
      } else if (question.questionType === 'open_ended') {
        // const percentageSimilar = stringSimilarity.compareTwoStrings(
        //   question.answer.toLowerCase().trim(),
        //   userInput.toLowerCase().trim(),
        // );

        // await this.prisma.question.update({
        //   where: { id: questionId },
        //   data: {
        //     percentageCorrect: Math.round(percentageSimilar * 100),
        //   },
        // });

        // You may want to return the percentage or use it as needed
        return true; // Assuming it's always correct for open-ended questions
      }

      // Handle other question types if needed
      return false;
    } catch (error) {
      // Handle errors accordingly (e.g., log, throw, etc.)
      throw error;
    }
  }
}
