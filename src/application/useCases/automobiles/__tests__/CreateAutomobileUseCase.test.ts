import { CreateAutomobileUseCase } from '../CreateAutomobileUseCase';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { Automobile } from '../../../../domain/entities/Automobile';
import { BadRequestError } from '../../../../domain/error/AppError';

describe('CreateAutomobileUseCase', () => {
	const makeRepo = (): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('cria um automóvel válido e chama o repositório', async () => {
		const repo = makeRepo();
		const useCase = new CreateAutomobileUseCase(repo);

		const result = await useCase.handle({ brand: 'Fiat', color: 'Preto', plate: 'ABC-1234' });

		expect(repo.create).toHaveBeenCalledTimes(1);
		expect(result).toBeInstanceOf(Automobile);
		expect(result.id).toEqual(expect.any(String));
		expect(result.brand).toBe('fiat');
		expect(result.color).toBe('preto');
		expect(result.plate).toBe('abc1234');
	});

	it('lança BadRequestError para dados inválidos', async () => {
		const repo = makeRepo();
		const useCase = new CreateAutomobileUseCase(repo);

		await expect(useCase.handle({ brand: 'F', color: 'P', plate: '123' } as any)).rejects.toBeInstanceOf(BadRequestError);
		expect(repo.create).not.toHaveBeenCalled();
	});
});


