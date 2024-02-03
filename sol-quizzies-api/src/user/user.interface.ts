export interface UserData {
  name?: string;
  email: string;
  token: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}
