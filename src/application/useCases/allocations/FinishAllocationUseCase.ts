import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { Allocation, AllocationStatus } from "../../../domain/entities/Allocation";
import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";

export interface IFinishAllocationDTO {
	allocationId: string;
}

export class FinishAllocationUseCase {
	constructor(
		private readonly allocationRepository: IAllocationRepository
	) {}

	async handle(args: IFinishAllocationDTO): Promise<Allocation> {
		const allocation = await this.allocationRepository.getById(args.allocationId);
		if (!allocation) {
			throw new NotFoundError('Allocation not found');
		}
		if (allocation.status !== AllocationStatus.IN_PROGRESS) {
			throw new BadRequestError('Allocation is already finished');
		}
		allocation.status = AllocationStatus.FINISHED;
		allocation.endDate = new Date();
		await this.allocationRepository.update(args.allocationId, allocation);
		return allocation;
	}
}