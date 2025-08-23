import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { GetByIdAutomobileUseCase } from "./GetByIdAutomobileUseCase";
import { deleteAutomobileSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";
import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";

interface DTO {
	id: string;
}

export class DeleteAutomobileUseCase {
	constructor(
		private automobileRepository: IAutomobileRepository,
		private getByIdAutomobileUseCase: GetByIdAutomobileUseCase,
		private allocationRepository: IAllocationRepository
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(deleteAutomobileSchema, args);
		const automobile = await this.getByIdAutomobileUseCase.handle(validatedData);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		const isAlreadyAllocated = await this.allocationRepository.findByAllocationByAutomobileIdInProgress(validatedData.id);
		if (isAlreadyAllocated) {
			throw new BadRequestError('Automobile is already allocated to a driver, please finish the allocation before deleting the automobile');
		}
		await this.automobileRepository.delete(validatedData.id);
	}
}