import { ListAutomobileUseCase } from '../ListAutomobileUseCase';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { Automobile } from '../../../../domain/entities/Automobile';

describe('ListAutomobileUseCase', () => {
	const makeRepo = (): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 1, totalPages: 1, items: [new Automobile('1', 'fiat', 'preto', 'abc1234')] })),
	});

	it('lista automóveis com filtros validados', async () => {
		const repo = makeRepo();
		const useCase = new ListAutomobileUseCase(repo);

		const result = await useCase.handle({ brand: 'Fiat', color: 'Preto', plate: 'ABC-1234', page: 1, limit: 10 });

		expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ brand: 'Fiat', color: 'Preto', plate: 'ABC1234', page: 1, limit: 10 }));
		expect(result.items.length).toBe(1);
	});
});


