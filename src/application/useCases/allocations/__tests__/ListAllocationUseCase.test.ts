import { ListAllocationUseCase } from '../ListAllocationUseCase';
import { IAllocationRepository } from '../../../../domain/repositories/allocationRepository';
import { Allocation, AllocationStatus } from '../../../../domain/entities/Allocation';
import { Driver } from '../../../../domain/entities/Driver';
import { Automobile } from '../../../../domain/entities/Automobile';

describe('ListAllocationUseCase', () => {
	const allocation = new Allocation(
		'1',
		new Driver('d1', 'john'),
		new Automobile('a1', 'fiat', 'preto', 'abc1234'),
		new Date('2023-01-01T00:00:00.000Z'),
		'teste',
		undefined,
		AllocationStatus.IN_PROGRESS,
	);

	const makeRepo = (): IAllocationRepository => ({
		create: jest.fn(async () => { }),
		getById: jest.fn(async () => null),
		update: jest.fn(async () => { }),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 1, totalPages: 1, items: [allocation] })),
		findByAllocationByDriverIdInProgress: jest.fn(async () => null),
		findByAllocationByAutomobileIdInProgress: jest.fn(async () => null),
	});

	it('lista alocações com filtros e mapeamento de driverName/automobilePlate', async () => {
		const repo = makeRepo();
		const useCase = new ListAllocationUseCase(repo);
		const result = await useCase.handle({ page: 1, limit: 10, driverName: 'John', automobilePlate: 'ABC-1234', status: AllocationStatus.IN_PROGRESS });
		expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10, status: AllocationStatus.IN_PROGRESS }));
		expect(result.items.length).toBe(1);
	});
});


