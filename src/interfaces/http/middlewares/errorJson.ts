import { Request, Response, NextFunction } from 'express';

export const errorJson = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};