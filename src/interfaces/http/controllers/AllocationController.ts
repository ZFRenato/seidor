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
		const { driverId, automobileId, description } = req.body;
		try {
			const allocation = await createAllocationUseCase.handle({ driverId, automobileId, description });
			return response.created(res, allocation);			
		} catch (error) {
			if (error instanceof BadRequestError) {
				return response.badRequest(res, error.message);
			} else if (error instanceof NotFoundError) {
				return response.notFound(res, error.message);
			} else {
				return response.internalServerError(res, error.message);
			}
		}
	}

	static async finishAllocation(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const allocation = await finishAllocationUseCase.handle({ allocationId: id });
			return response.ok(res, allocation);
		} catch (error) {
			if (error instanceof BadRequestError) {
				return response.badRequest(res, error.message);
			} else if (error instanceof NotFoundError) {
				return response.notFound(res, error.message);
			} else {
				return response.internalServerError(res, error.message);
			}
		}
	}

	static async listAllocations(req: Request, res: Response) {
		const { page, limit, driverName, automobilePlate, status } = req.query as { page?: number, limit?: number, driverName?: string, automobilePlate?: string, status?: AllocationStatus };
		try {
			const allocations = await listAllocationUseCase.handle({ page, limit, driverName, automobilePlate, status });
			return response.ok(res, allocations);
		} catch (error) {
			return response.internalServerError(res, error.message);
		}
	}
}