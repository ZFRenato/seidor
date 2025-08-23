import { GetByIdAutomobileUseCase } from '../GetByIdAutomobileUseCase';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { Automobile } from '../../../../domain/entities/Automobile';
import { BadRequestError } from '../../../../domain/error/AppError';

describe('GetByIdAutomobileUseCase', () => {
	const makeRepo = (auto: Automobile | null): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => auto),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('retorna automóvel quando encontrado', async () => {
		const auto = new Automobile('1', 'fiat', 'preto', 'abc1234');
		const repo = makeRepo(auto);
		const useCase = new GetByIdAutomobileUseCase(repo);
		const result = await useCase.handle({ id: '1' });
		expect(result).toBe(auto);
		expect(repo.getById).toHaveBeenCalledWith('1');
	});

	it('falha na validação quando id ausente', async () => {
		const repo = makeRepo(null);
		const useCase = new GetByIdAutomobileUseCase(repo);
		await expect(useCase.handle({} as any)).rejects.toBeInstanceOf(BadRequestError);
	});
});


