import { Request, Response, NextFunction } from 'express';
import { response } from '../util/responseHttp';
import { AppError } from '../../../domain/error/AppError';

const sendByStatus: Record<number, (res: Response, data: unknown) => void> = {
	400: response.badRequest,
	404: response.notFound,
	500: response.internalServerError,
};

export const errorHttp = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof AppError) {
		const send = sendByStatus[err.statusCode] ?? response.internalServerError;
		return send(res, { message: err.message });
	}
	console.log(err);
	return response.internalServerError(res, { message: err.message || 'Erro interno do servidor' });
};