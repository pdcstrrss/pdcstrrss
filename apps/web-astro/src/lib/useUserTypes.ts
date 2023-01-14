export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type UserSession = {
  accessToken: string;
  user: User;
  iat: number;
};
