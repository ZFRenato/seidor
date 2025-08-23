import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { getAutomobileByIdSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
}

export class GetByIdAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: DTO): Promise<Automobile | null> {
		const validatedData = await validator(getAutomobileByIdSchema, args);
		return this.automobileRepository.getById(validatedData.id);
	}
}