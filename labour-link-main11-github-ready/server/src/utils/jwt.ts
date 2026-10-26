import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '7d'
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};

export const generateAdminToken = (payload: object): string => {
  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET as string, {
    expiresIn: '1d'
  } as jwt.SignOptions);
};