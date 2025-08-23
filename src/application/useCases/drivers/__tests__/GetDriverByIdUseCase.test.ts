import { GetDriverByIdUseCase } from '../GetDriverByIdUseCase';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { BadRequestError } from '../../../../domain/error/AppError';

describe('GetDriverByIdUseCase', () => {
	const makeRepo = (driver: Driver | null): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => driver),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('retorna driver quando encontrado', async () => {
		const d = new Driver('1', 'john');
		const repo = makeRepo(d);
		const useCase = new GetDriverByIdUseCase(repo);
		const result = await useCase.handle({ id: '1' });
		expect(result).toBe(d);
		expect(repo.getById).toHaveBeenCalledWith('1');
	});

	it('falha de validação para id ausente', async () => {
		const repo = makeRepo(null);
		const useCase = new GetDriverByIdUseCase(repo);
		await expect(useCase.handle({} as any)).rejects.toBeInstanceOf(BadRequestError);
	});
});


