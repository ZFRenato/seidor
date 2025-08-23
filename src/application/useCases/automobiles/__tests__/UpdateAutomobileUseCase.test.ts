import { UpdateAutomobileUseCase } from '../UpdateAutomobileUseCase';
import { GetByIdAutomobileUseCase } from '../GetByIdAutomobileUseCase';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { Automobile } from '../../../../domain/entities/Automobile';
import { NotFoundError } from '../../../../domain/error/AppError';

describe('UpdateAutomobileUseCase', () => {
	const makeRepo = (auto: Automobile | null): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async (id: string) => auto),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('atualiza quando automóvel existe', async () => {
		const existing = new Automobile('1', 'fiat', 'preto', 'abc1234');
		const repo = makeRepo(existing);
		const getById = new GetByIdAutomobileUseCase(repo);
		const useCase = new UpdateAutomobileUseCase(repo, getById);
		await useCase.handle({ id: '1', color: 'branco' });
		expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ color: 'branco' }));
	});

	it('lança NotFoundError quando não existe', async () => {
		const repo = makeRepo(null);
		const getById = new GetByIdAutomobileUseCase(repo);
		const useCase = new UpdateAutomobileUseCase(repo, getById);
		await expect(useCase.handle({ id: 'x' })).rejects.toBeInstanceOf(NotFoundError);
	});
});


