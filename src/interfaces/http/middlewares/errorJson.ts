import { Request, Response, NextFunction } from 'express';
import { response } from '../util/responseHttp';

export const errorJson = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
	response.badRequest(res, { message: err.message });
  }
  next();
};