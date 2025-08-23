import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { IPagination } from "../../../util/IPagination";
import { listAutomobileSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	brand?: string;
	color?: string;
	plate?: string;
	page?: number;
	limit?: number;
}

export class ListAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: DTO): Promise<IPagination<Automobile>> {
		const validatedData = await validator(listAutomobileSchema, args);
		return this.automobileRepository.list(validatedData);
	}
}