import { DeleteDriverUseCase } from '../DeleteDriverUseCase';
import { GetDriverByIdUseCase } from '../GetDriverByIdUseCase';
import { IDriverRepository } from '../../../../domain/repositories/DriverRepository';
import { IAllocationRepository } from '../../../../domain/repositories/allocationRepository';
import { Driver } from '../../../../domain/entities/Driver';
import { BadRequestError, NotFoundError } from '../../../../domain/error/AppError';

describe('DeleteDriverUseCase', () => {
	const makeDriverRepo = (driver: Driver | null): IDriverRepository => ({
		create: jest.fn(async (d: Driver) => d),
		update: jest.fn(async () => ({ } as Driver)),
		delete: jest.fn(async () => { }),
		getById: jest.fn(async () => driver),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
	});

	const makeAllocRepo = (allocated: boolean): IAllocationRepository => ({
		create: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		update: jest.fn(async () => { }),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
		findByAllocationByDriverIdInProgress: jest.fn(async () => allocated ? ({} as any) : null),
		findByAllocationByAutomobileIdInProgress: jest.fn(async () => null),
	});

	it('exclui quando não alocado', async () => {
		const driver = new Driver('1', 'john');
		const driverRepo = makeDriverRepo(driver);
		const allocRepo = makeAllocRepo(false);
		const getById = new GetDriverByIdUseCase(driverRepo);
		const useCase = new DeleteDriverUseCase(driverRepo, getById, allocRepo);
		await useCase.handle({ id: '1' });
		expect(driverRepo.delete).toHaveBeenCalledWith('1');
	});

	it('lança NotFoundError quando não existe', async () => {
		const driverRepo = makeDriverRepo(null);
		const allocRepo = makeAllocRepo(false);
		const getById = new GetDriverByIdUseCase(driverRepo);
		const useCase = new DeleteDriverUseCase(driverRepo, getById, allocRepo);
		await expect(useCase.handle({ id: 'x' })).rejects.toBeInstanceOf(NotFoundError);
	});

	it('lança BadRequestError quando já alocado', async () => {
		const driver = new Driver('1', 'john');
		const driverRepo = makeDriverRepo(driver);
		const allocRepo = makeAllocRepo(true);
		const getById = new GetDriverByIdUseCase(driverRepo);
		const useCase = new DeleteDriverUseCase(driverRepo, getById, allocRepo);
		await expect(useCase.handle({ id: '1' })).rejects.toBeInstanceOf(BadRequestError);
	});
});


