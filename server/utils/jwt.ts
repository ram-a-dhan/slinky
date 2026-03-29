import jwt from "jsonwebtoken";

export interface jwtPayload {
  userId: string;
  email: string;
  googleAccessToken: string;
  isAdmin?: boolean;
}

export const signJwt = (payload: jwtPayload): string => {
  const config = useRuntimeConfig();

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwt = (token: string): jwtPayload | null => {
  const config = useRuntimeConfig();

  try {
    return jwt.verify(token, config.JWT_SECRET) as jwtPayload;
  } catch (error) {
    return null;
  }
};