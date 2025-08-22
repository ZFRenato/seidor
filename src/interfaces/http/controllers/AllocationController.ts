import { Request, Response } from 'express';
import { response } from '../util/responseHttp';
import { CreateAllocationUseCase } from '../../../application/useCases/allocations/CreateAllocationUseCase';
import { FinishAllocationUseCase } from '../../../application/useCases/allocations/FinishAllocationUseCase';
import { ListAllocationUseCase } from '../../../application/useCases/allocations/ListAllocationUseCase';
import { InMemoryAllocationRepository } from '../../../infrastructure/persistence/InMenoryAllocationRepository';
import { InMemoryAutomobileRepository } from '../../../infrastructure/persistence/InMemoryAutomobileRepository';
import { InMemoryDriverRepository } from '../../../infrastructure/persistence/InMenoryDriverRepository';
import { AllocationStatus } from '../../../domain/entities/Allocation';
import { BadRequestError, NotFoundError } from '../../../domain/error/AppError';

const allocationRepository = new InMemoryAllocationRepository();
const createAllocationUseCase = new CreateAllocationUseCase(
	allocationRepository,
	new InMemoryDriverRepository(),
	new InMemoryAutomobileRepository(),
);
const finishAllocationUseCase = new FinishAllocationUseCase(new InMemoryAllocationRepository());
const listAllocationUseCase = new ListAllocationUseCase(new InMemoryAllocationRepository());

export class AllocationController {
	static async createAllocation(req: Request, res: Response) {
		const { driverId, automobileId, description } = req.body;
		try {
			const allocation = await createAllocationUseCase.handle({ driverId, automobileId, description });
			response.created(res, allocation);			
		} catch (error) {
			if (error instanceof BadRequestError) {
				response.badRequest(res, error.message);
			} else if (error instanceof NotFoundError) {
				response.notFound(res, error.message);
			} else {
				response.internalServerError(res, error.message);
			}
		}
	}

	static async finishAllocation(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const allocation = await finishAllocationUseCase.handle({ allocationId: id });
			response.ok(res, allocation);
		} catch (error) {
			if (error instanceof BadRequestError) {
				response.badRequest(res, error.message);
			} else if (error instanceof NotFoundError) {
				response.notFound(res, error.message);
			} else {
				response.internalServerError(res, error.message);
			}
		}
	}

	static async listAllocations(req: Request, res: Response) {
		const { page, limit, driverName, automobilePlate, status } = req.query as { page?: number, limit?: number, driverName?: string, automobilePlate?: string, status?: AllocationStatus };
		try {
			const allocations = await listAllocationUseCase.handle({ page, limit, driverName, automobilePlate, status });
			response.ok(res, allocations);
		} catch (error) {
			response.internalServerError(res, error.message);
		}
	}
}