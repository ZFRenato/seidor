import { CreateDriverUseCase } from '../CreateDriverUseCase';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { BadRequestError } from '../../../../domain/error/AppError';

describe('CreateDriverUseCase', () => {
	const makeRepo = (): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('cria driver válido', async () => {
		const repo = makeRepo();
		const useCase = new CreateDriverUseCase(repo);
		const result = await useCase.handle({ name: 'John Doe' });
		expect(repo.create).toHaveBeenCalledTimes(1);
		expect(result).toBeInstanceOf(Driver);
		expect(result.name).toBe('john doe');
	});

	it('lança BadRequestError para dados inválidos', async () => {
		const repo = makeRepo();
		const useCase = new CreateDriverUseCase(repo);
		await expect(useCase.handle({ name: '' } as any)).rejects.toBeInstanceOf(BadRequestError);
		expect(repo.create).not.toHaveBeenCalled();
	});
});


