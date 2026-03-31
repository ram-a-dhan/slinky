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
  slug: string;
  target: string;
  userId?: string;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface IQrOptions {
  id: string;
  style: "rounded" | "circles" | "diamond";
  color1: string;
  color2: string;
  invert: boolean;
  gradientType: "none" | "linear" | "radial";
  gradientAngle: number;
  imageUrl: string;
  userId: string;
}