import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { GetDriverByIdUseCase } from "./GetDriverByIdUseCase";
import { deleteDriverSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";
import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";

interface DTO {
	id: string;
}

export class DeleteDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository,
		private getDriverByIdUseCase: GetDriverByIdUseCase,
		private allocationRepository: IAllocationRepository
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(deleteDriverSchema, args);
		const driver = await this.getDriverByIdUseCase.handle(validatedData);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		const isAlreadyAllocated = await this.allocationRepository.findByAllocationByDriverIdInProgress(validatedData.id);
		if (isAlreadyAllocated) {
			throw new BadRequestError('Driver is already allocated to an automobile, please finish the allocation before deleting the driver');
		}
		await this.driverRepository.delete(validatedData.id);
	}
}