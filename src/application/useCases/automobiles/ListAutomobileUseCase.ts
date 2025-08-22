import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { IPagination } from "../../../util/IPagination";

interface ListAutomobileUseCaseDTO {
	filters: {
		brand?: string;
		color?: string;
		plate?: string;
		page?: number;
		limit?: number;
	}
}

export class ListAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: ListAutomobileUseCaseDTO): Promise<IPagination<Automobile>> {
		return this.automobileRepository.list(args.filters);
	}
}