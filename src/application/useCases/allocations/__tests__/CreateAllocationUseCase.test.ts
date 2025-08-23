import { CreateAllocationUseCase } from '../CreateAllocationUseCase';
import { IAllocationRepository } from '../../../../domain/repositories/allocationRepository';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { IAutomobileRepository } from '../../../../domain/repositories/AutomobileRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { Automobile } from '../../../../domain/entities/Automobile';
import { Allocation } from '../../../../domain/entities/Allocation';
import { BadRequestError, NotFoundError } from '../../../../domain/error/AppError';

describe('CreateAllocationUseCase', () => {
	const makeAllocRepo = (driverHasAlloc: boolean, autoHasAlloc: boolean): IAllocationRepository => ({
		create: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		update: jest.fn(async () => { }),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
		findByAllocationByDriverIdInProgress: jest.fn(async () => driverHasAlloc ? ({} as Allocation) : null),
		findByAllocationByAutomobileIdInProgress: jest.fn(async () => autoHasAlloc ? ({} as Allocation) : null),
	});

	const makeDriverRepo = (driver: Driver | null): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => driver),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	const makeAutoRepo = (auto: Automobile | null): IAutomobileRepository => ({
		create: jest.fn(async (a: Automobile) => a),
		update: jest.fn(async () => ({ } as Automobile)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => auto),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	it('cria alocação quando motorista e veículo livres', async () => {
		const driver = new Driver('d1', 'john');
		const auto = new Automobile('a1', 'fiat', 'preto', 'abc1234');
		const allocRepo = makeAllocRepo(false, false);
		const driverRepo = makeDriverRepo(driver);
		const autoRepo = makeAutoRepo(auto);
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		const result = await useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'Teste ok' });
		expect(allocRepo.create).toHaveBeenCalledTimes(1);
		expect(result).toBeInstanceOf(Allocation);
		expect(result.driver).toBe(driver);
		expect(result.automobile).toBe(auto);
	});

	it('falha quando driver inexistente', async () => {
		const allocRepo = makeAllocRepo(false, false);
		const driverRepo = makeDriverRepo(null);
		const autoRepo = makeAutoRepo(new Automobile('a1', 'fiat', 'preto', 'abc1234'));
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		await expect(useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'Teste ok' })).rejects.toBeInstanceOf(NotFoundError);
	});

	it('falha quando driver já possui alocação', async () => {
		const driver = new Driver('d1', 'john');
		const allocRepo = makeAllocRepo(true, false);
		const driverRepo = makeDriverRepo(driver);
		const autoRepo = makeAutoRepo(new Automobile('a1', 'fiat', 'preto', 'abc1234'));
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		await expect(useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'Teste ok' })).rejects.toBeInstanceOf(BadRequestError);
	});

	it('falha quando automóvel inexistente', async () => {
		const driver = new Driver('d1', 'john');
		const allocRepo = makeAllocRepo(false, false);
		const driverRepo = makeDriverRepo(driver);
		const autoRepo = makeAutoRepo(null);
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		await expect(useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'Teste ok' })).rejects.toBeInstanceOf(NotFoundError);
	});

	it('falha quando automóvel já possui alocação', async () => {
		const driver = new Driver('d1', 'john');
		const allocRepo = makeAllocRepo(false, true);
		const driverRepo = makeDriverRepo(driver);
		const autoRepo = makeAutoRepo(new Automobile('a1', 'fiat', 'preto', 'abc1234'));
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		await expect(useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'Teste ok' })).rejects.toBeInstanceOf(BadRequestError);
	});

	it('validação: descrição muito curta', async () => {
		const driver = new Driver('d1', 'john');
		const auto = new Automobile('a1', 'fiat', 'preto', 'abc1234');
		const allocRepo = makeAllocRepo(false, false);
		const driverRepo = makeDriverRepo(driver);
		const autoRepo = makeAutoRepo(auto);
		const useCase = new CreateAllocationUseCase(allocRepo, driverRepo, autoRepo);
		await expect(useCase.handle({ driverId: 'd1', automobileId: 'a1', description: 'x' } as any)).rejects.toBeInstanceOf(BadRequestError);
	});
});


