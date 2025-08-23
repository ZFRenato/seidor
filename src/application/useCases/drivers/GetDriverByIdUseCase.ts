import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { getDriverByIdSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
}

export class GetDriverByIdUseCase {
	constructor(private driverRepository: IDriverRepository) {}

	async handle(args: DTO): Promise<Driver | null> {
		const validatedData = await validator(getDriverByIdSchema, args);
		return this.driverRepository.getById(validatedData.id);
	}
}