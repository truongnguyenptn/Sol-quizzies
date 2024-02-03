import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // async findAll(): Promise<UserEntity[]> {
  //   return await this.prisma.user.findMany();
  // }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = {};
    if (!user) {
      return null;
    }

    return null;
  }

  async create(dto: CreateUserDto) {
    // check uniqueness of username/email
    const { username, email, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: { name: username },
    });

    if (user) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      // const savedUser = await this.prisma.user.save(newUser);
      // return this.buildUserRO(savedUser);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const toUpdate = await this.prisma.user.findFirst({ where: { id: id } });

    const updated = Object.assign(toUpdate, dto);
    return await this.prisma.user.update({ where: { id: id }, data: updated });
  }

  async findById(id: string): Promise<UserRO> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      SECRET,
    );
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateJWT(user),
      image: user.image,
    };

    return { user: userRO };
  }
}
