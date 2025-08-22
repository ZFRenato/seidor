import { Request, Response, NextFunction } from 'express';
import { response } from '../util/responseHttp';

export const errorJson = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
	const result = response.badRequest({ message: err.message });
    return res.status(result.statusCode).json(result.body);
  }

  next();
};