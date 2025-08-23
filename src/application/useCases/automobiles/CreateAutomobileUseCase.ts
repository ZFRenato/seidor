import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { v4 as uuidv4 } from 'uuid';
import { createAutomobileSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	brand: string;
	color: string;
	plate: string;
}

export class CreateAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: DTO): Promise<Automobile> {
		const validatedData = await validator(createAutomobileSchema, args);
		const automobile = new Automobile(uuidv4(), validatedData.brand, validatedData.color, validatedData.plate);
		return this.automobileRepository.create(automobile);
	}
}