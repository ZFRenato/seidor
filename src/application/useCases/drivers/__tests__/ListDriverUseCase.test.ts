import { ListDriverUseCase } from '../ListDriverUseCase';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { Driver } from '../../../../domain/entities/Driver';

describe('ListDriverUseCase', () => {
	const makeRepo = (): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 1, totalPages: 1, items: [new Driver('1', 'john doe')] })),
	});

	it('lista drivers com filtros validados', async () => {
		const repo = makeRepo();
		const useCase = new ListDriverUseCase(repo);
		const result = await useCase.handle({ name: 'John', page: 1, limit: 10 });
		expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ name: 'John', page: 1, limit: 10 }));
		expect(result.items.length).toBe(1);
	});
});


