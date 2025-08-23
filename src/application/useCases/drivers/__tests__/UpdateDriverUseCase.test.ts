import { UpdateDriverUseCase } from '../UpdateDriverUseCase';
import { GetDriverByIdUseCase } from '../GetDriverByIdUseCase';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { NotFoundError } from '../../../../domain/error/AppError';

describe('UpdateDriverUseCase', () => {
	const makeRepo = (driver: Driver | null): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => driver),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('atualiza quando driver existe', async () => {
		const existing = new Driver('1', 'john');
		const repo = makeRepo(existing);
		const getById = new GetDriverByIdUseCase(repo);
		const useCase = new UpdateDriverUseCase(repo, getById);
		await useCase.handle({ id: '1', name: 'jane' });
		expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'jane' }));
	});

	it('lança NotFoundError quando não existe', async () => {
		const repo = makeRepo(null);
		const getById = new GetDriverByIdUseCase(repo);
		const useCase = new UpdateDriverUseCase(repo, getById);
		await expect(useCase.handle({ id: 'x' })).rejects.toBeInstanceOf(NotFoundError);
	});
});


