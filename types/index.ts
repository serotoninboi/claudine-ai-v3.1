export interface PublicUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
}
