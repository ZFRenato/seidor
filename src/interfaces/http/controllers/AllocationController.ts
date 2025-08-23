import { Request, Response } from 'express';
import { response } from '../util/responseHttp';
import { CreateAllocationUseCase } from '../../../application/useCases/allocations/CreateAllocationUseCase';
import { FinishAllocationUseCase } from '../../../application/useCases/allocations/FinishAllocationUseCase';
import { ListAllocationUseCase } from '../../../application/useCases/allocations/ListAllocationUseCase';
import { InMemoryAllocationRepository } from '../../../infrastructure/persistence/InMenoryAllocationRepository';
import { InMemoryAutomobileRepository } from '../../../infrastructure/persistence/InMemoryAutomobileRepository';
import { InMemoryDriverRepository } from '../../../infrastructure/persistence/InMenoryDriverRepository';

const allocationRepository = InMemoryAllocationRepository.getInstance();
const createAllocationUseCase = new CreateAllocationUseCase(
	allocationRepository,
	InMemoryDriverRepository.getInstance(),
	InMemoryAutomobileRepository.getInstance(),
);
const finishAllocationUseCase = new FinishAllocationUseCase(InMemoryAllocationRepository.getInstance());
const listAllocationUseCase = new ListAllocationUseCase(InMemoryAllocationRepository.getInstance());

export class AllocationController {
	static async createAllocation(req: Request, res: Response) {
			const allocation = await createAllocationUseCase.handle(req.body);
			return response.created(res, allocation);
	}

	static async finishAllocation(req: Request, res: Response) {
		const { id } = req.params;
			const allocation = await finishAllocationUseCase.handle({ id });
			return response.ok(res, allocation);
	}

	static async listAllocations(req: Request, res: Response) {
		const allocations = await listAllocationUseCase.handle(req.query);
			return response.ok(res, allocations);
	}
}