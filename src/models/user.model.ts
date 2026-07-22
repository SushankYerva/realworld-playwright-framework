export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  username: string;
  email: string;
  token: string;
  bio?: string | null;
  image?: string | null;
}

export interface UserResponse {
  user: RegisteredUser;
}