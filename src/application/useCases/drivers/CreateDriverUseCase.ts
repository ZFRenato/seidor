import { v4 as uuidv4 } from 'uuid';
import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { createDriverSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	name: string;
}

export class CreateDriverUseCase {
	constructor(private driverRepository: IDriverRepository) {}

	async handle(args: DTO): Promise<Driver> {
		const validatedData = await validator(createDriverSchema, args);
		const driver = new Driver(uuidv4(), validatedData.name);
		return this.driverRepository.create(driver);
	}
}