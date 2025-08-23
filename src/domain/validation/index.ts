import { AnySchema } from 'joi';
import { BadRequestError } from '../error/AppError';

const validator = async <D>(
	schema: AnySchema,
	data: D
): Promise<D> => {
	try {
		const value = await schema.validateAsync(data, { stripUnknown: true });
		return value;
	} catch (error) {
		throw new BadRequestError(error instanceof Error ? error.message : 'Invalid data');
	}
};

export { validator };