import * as dotenv from 'dotenv';

export const SECRET = 'secret-key';
dotenv.config();

export const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
