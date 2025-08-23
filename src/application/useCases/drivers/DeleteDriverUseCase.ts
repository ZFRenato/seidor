import { NotFoundError } from "../../../domain/error/AppError";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { GetDriverByIdUseCase } from "./GetDriverByIdUseCase";
import { deleteDriverSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
}

export class DeleteDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository,
		private getDriverByIdUseCase: GetDriverByIdUseCase
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(deleteDriverSchema, args);
		const driver = await this.getDriverByIdUseCase.handle(validatedData);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		await this.driverRepository.delete(validatedData.id);
	}
}