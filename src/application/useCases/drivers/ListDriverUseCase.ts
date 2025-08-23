import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { IPagination } from "../../../util/IPagination";
import { listDriverSchema } from "./driverSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	name?: string;
	page?: number;
	limit?: number;
}

export class ListDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository
	) {}

	async handle(args: DTO): Promise<IPagination<Driver>> {
		const validatedData = await validator(listDriverSchema, args);
		return this.driverRepository.list(validatedData);
	}
}