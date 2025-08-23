import { DeleteAutomobileUseCase } from '../DeleteAutomobileUseCase';
import { GetByIdAutomobileUseCase } from '../GetByIdAutomobileUseCase';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { IAllocationRepository } from '../../../../domain/repositories/allocationRepository';
import { Automobile } from '../../../../domain/entities/Automobile';
import { BadRequestError, NotFoundError } from '../../../../domain/error/AppError';

describe('DeleteAutomobileUseCase', () => {
	const makeAutoRepo = (auto: Automobile | null): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => auto),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	const makeAllocRepo = (allocated: boolean): IAllocationRepository => ({
		create: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		update: jest.fn(async () => { }),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
		findByAllocationByDriverIdInProgress: jest.fn(async () => null),
		findByAllocationByAutomobileIdInProgress: jest.fn(async () => allocated ? ({} as any) : null),
	});

	it('exclui quando não alocado', async () => {
		const auto = new Automobile('1', 'fiat', 'preto', 'abc1234');
		const autoRepo = makeAutoRepo(auto);
		const allocRepo = makeAllocRepo(false);
		const getById = new GetByIdAutomobileUseCase(autoRepo);
		const useCase = new DeleteAutomobileUseCase(autoRepo, getById, allocRepo);
		await useCase.handle({ id: '1' });
		expect(autoRepo.delete).toHaveBeenCalledWith('1');
	});

	it('lança NotFoundError quando não existe', async () => {
		const autoRepo = makeAutoRepo(null);
		const allocRepo = makeAllocRepo(false);
		const getById = new GetByIdAutomobileUseCase(autoRepo);
		const useCase = new DeleteAutomobileUseCase(autoRepo, getById, allocRepo);
		await expect(useCase.handle({ id: 'x' })).rejects.toBeInstanceOf(NotFoundError);
	});

	it('lança BadRequestError quando já alocado', async () => {
		const auto = new Automobile('1', 'fiat', 'preto', 'abc1234');
		const autoRepo = makeAutoRepo(auto);
		const allocRepo = makeAllocRepo(true);
		const getById = new GetByIdAutomobileUseCase(autoRepo);
		const useCase = new DeleteAutomobileUseCase(autoRepo, getById, allocRepo);
		await expect(useCase.handle({ id: '1' })).rejects.toBeInstanceOf(BadRequestError);
	});
});


