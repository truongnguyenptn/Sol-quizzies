import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitgameDto } from './dto/submit-game.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { Game } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionsService: QuestionsService,
  ) {}
  async create(createGameDto: CreateGameDto) {
    const { topic, type, amount } = createGameDto;

    const data = await this.questionsService.generate({
      amount,
      topic,
      type,
    });
    console.log({ test: data?.questions });
    if (!data?.questions && data?.questions?.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Questions not created! Please try again',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const game = await this.prisma.game.create({
      data: {
        gameType: type || 'mcq',
        timeStarted: new Date(),
        //TODO: adds auth admin
        userId: 'admin',
        topic: topic || 'testTopic',
      },
    });
    if (type === 'mcq') {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        // mix up the options lol
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: 'mcq',
        };
      });

      await this.prisma.question.createMany({
        data: manyData,
      });
    } else if (type === 'open_ended') {
      type openQuestion = {
        question: string;
        answer: string;
      };
      await this.prisma.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: 'open_ended',
          };
        }),
      });
    }
    return { gameId: game.id };
  }

  async findAll() {
    return await this.prisma.game.findMany();
  }

  async findOne(gameId: string): Promise<Game> {
    if (!gameId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Game not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        Question: {
          select: {
            id: true,
            question: true,
            options: true,
          },
        },
      },
    });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  async startGame(startgameDto: StartGameDto) {
    const { gameId, userId } = startgameDto;
    const attemptCount = await this.prisma.attempt.count({
      where: {
        gameId: gameId,
        userId: userId,
      },
    });

    const attempt = await this.prisma.attempt.create({
      data: {
        gameId: gameId,
        userId: userId,
        timeStarted: new Date(),
        attemptCount: attemptCount + 1,
      },
    });
    return attempt;
  }

  async getDetailedGameStatistics(gameId: string, userId: string) {
    console.log({ gameId }, { userId });
    const attemptCount = await this.prisma.attempt.count({
      where: {
        gameId: gameId,
        userId: userId,
      },
    });
    const lastAttempt = await this.prisma.attempt.findFirst({
      where: {
        gameId: gameId,
        userId: userId,
        attemptCount: attemptCount,
      },
    });
    console.log({ lastAttempt }, { attemptCount });
    // Find questions for the given game and user
    const questions = await this.prisma.question.findMany({
      where: {
        gameId: gameId,
      },
      select: {
        id: true,
        question: true,
        options: true,
      },
    });
    console.log({ questions });
    // Initialize result object
    const result = {
      accuracy: lastAttempt?.percentageCorrect || 0,
      questions: [],
      score: 0,
      // time: {
      //   start: lastAttempt?. || 0,
      //   end: lastAttempt?.updatedAt || 1,
      // }
    };

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log({ question });

      // Find the answer for the current question
      const answer = await this.prisma.answer.findFirst({
        where: {
          attemptId: lastAttempt?.id,
          questionId: question.id,
        },
      });
      console.log({ answer });
      // Add question details and answer to the result
      result.questions.push({
        question: question.question,
        options: question.options,
        userAnswer: answer?.userAnswer,
        isCorrect: answer?.isCorrect,
      });
    }
    return result;
  }
  async submitGame(submitGameDto: SubmitgameDto) {
    const { gameId, userId, attemptId } = submitGameDto;
    console.log({ gameId }, { userId }, { attemptId });
    let accuracy: number = 0;
    const questions = await this.prisma.question.findMany({
      where: {
        gameId: gameId,
      },
      select: {
        id: true,
        question: true,
        options: true,
      },
    });
    console.log({ questions });

    let totalCorrect = 0;
    // Loop through each question to gather answers and accuracy
    for (let i = 0; i < questions?.length; i++) {
      const question = questions?.[i];

      // Find the answer for the current question
      const answer = await this.prisma.answer.findFirst({
        where: {
          attemptId: attemptId,
          questionId: question.id,
          userId: userId,
        },
      });
      console.log({ answer });

      if (answer?.isCorrect) {
        totalCorrect += 1;
      }
    }

    accuracy = (totalCorrect / questions?.length) * 100;
    await this.prisma.attempt.update({
      where: {
        id: attemptId,
        userId: userId,
      },
      data: {
        timeEnded: new Date(),
        percentageCorrect: accuracy,
      },
    });
  }

  async getLeaderboard(gameId: string): Promise<any[]> {
    const leaderboard = await this.prisma.attempt.findMany({
      where: {
        gameId: gameId,
        isFinished: true,
      },
      orderBy: [{ score: 'desc' }],
      select: {
        userId: true,
        score: true,
      },
    });

    return leaderboard;
  }
}
