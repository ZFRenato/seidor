import { Driver } from "../../../domain/entities/Driver";
import { NotFoundError } from "../../../domain/error/AppError";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { GetDriverByIdUseCase } from "./GetDriverByIdUseCase";
import { updateDriverSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
	name?: string;
}

export class UpdateDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository,
		private getDriverByIdUseCase: GetDriverByIdUseCase
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(updateDriverSchema, args);
		const driver = await this.getDriverByIdUseCase.handle({ id: validatedData.id });
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		await this.driverRepository.update(validatedData.id, validatedData);
	}
}