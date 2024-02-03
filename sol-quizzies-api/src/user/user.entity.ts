import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  username?: string;
  emailVerified: Date;
  name: string;

  email: string;

  image: string;

  password?: string;
}
