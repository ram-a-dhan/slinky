export interface IUser {
  id: string;
  email: string;
  username: string;
  lastAccessedAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface ILink {
  id: string;
  source: string;
  target: string;
  userId?: string;
  createdAt: Date;
  lastAccessedAt: Date;
}
