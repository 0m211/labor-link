import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from './errorHandler';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Not authorized for this action', 403));
    }
    next();
  };
};