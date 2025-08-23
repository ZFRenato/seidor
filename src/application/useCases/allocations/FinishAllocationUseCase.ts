import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { Allocation, AllocationStatus } from "../../../domain/entities/Allocation";
import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";
import { finishAllocationSchema } from "./allocationSchemaImput";
import { validator } from "../../../domain/validation";

export interface DTO {
	id: string;
}

export class FinishAllocationUseCase {
	constructor(
		private readonly allocationRepository: IAllocationRepository
	) {}

	async handle(args: DTO): Promise<Allocation> {
		const { id } = await validator(finishAllocationSchema, args);
		const allocation = await this.allocationRepository.getById(id);
		if (!allocation) {
			throw new NotFoundError('Allocation not found');
		}
		if (allocation.status !== AllocationStatus.IN_PROGRESS) {
			throw new BadRequestError('Allocation is already finished');
		}
		allocation.status = AllocationStatus.FINISHED;
		allocation.endDate = new Date();
		await this.allocationRepository.update(id, allocation);
		return allocation;
	}
}