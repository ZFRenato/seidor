import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { IPagination } from "../../../util/IPagination";

interface ListDriverUseCaseDTO {
	name?: string;
	page?: number;
	limit?: number;
}

export class ListDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository
	) {}

	async handle(args: ListDriverUseCaseDTO): Promise<IPagination<Driver>> {
		return this.driverRepository.list(args);
	}
}