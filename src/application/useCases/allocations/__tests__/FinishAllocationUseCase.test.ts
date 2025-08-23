import { FinishAllocationUseCase } from '../FinishAllocationUseCase';
import { IAllocationRepository } from '../../../../domain/repositories/allocationRepository';
import { Allocation, AllocationStatus } from '../../../../domain/entities/Allocation';
import { Driver } from '../../../../domain/entities/Driver';
import { Automobile } from '../../../../domain/entities/Automobile';
import { BadRequestError, NotFoundError } from '../../../../domain/error/AppError';

const makeAllocation = (status: AllocationStatus) => new Allocation(
	'alloc1',
	new Driver('d1', 'john'),
	new Automobile('a1', 'fiat', 'preto', 'abc1234'),
	new Date('2023-01-01T00:00:00.000Z'),
	'teste',
	undefined,
	status,
);

describe('FinishAllocationUseCase', () => {
	const makeRepo = (allocation: Allocation | null): IAllocationRepository => ({
		create: jest.fn(async () => { }),
		getById: jest.fn(async (id: string) => allocation),
		update: jest.fn(async () => { }),
		list: jest.fn(async () => ({ page: 1, limit: 10, total: 0, totalPages: 0, items: [] })),
		findByAllocationByDriverIdInProgress: jest.fn(async () => null),
		findByAllocationByAutomobileIdInProgress: jest.fn(async () => null),
	});

	it('finaliza alocação em progresso', async () => {
		const repo = makeRepo(makeAllocation(AllocationStatus.IN_PROGRESS));
		const useCase = new FinishAllocationUseCase(repo);
		const result = await useCase.handle({ id: 'alloc1' });
		expect(result.status).toBe(AllocationStatus.FINISHED);
		expect(result.endDate).not.toBeNull();
		expect(repo.update).toHaveBeenCalledWith('alloc1', expect.any(Object));
	});

	it('lança NotFoundError quando alocação não existe', async () => {
		const repo = makeRepo(null);
		const useCase = new FinishAllocationUseCase(repo);
		await expect(useCase.handle({ id: 'x' })).rejects.toBeInstanceOf(NotFoundError);
	});

	it('lança BadRequestError quando já finalizada', async () => {
		const repo = makeRepo(makeAllocation(AllocationStatus.FINISHED));
		const useCase = new FinishAllocationUseCase(repo);
		await expect(useCase.handle({ id: 'alloc1' })).rejects.toBeInstanceOf(BadRequestError);
	});
});


