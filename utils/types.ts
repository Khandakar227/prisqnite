export type User = {
  email: string;
  password: string;
  [key: string]: any;
};

export type UserInfo = User & {
  firstname: string;
  lastname: string;
  verified: boolean;
}