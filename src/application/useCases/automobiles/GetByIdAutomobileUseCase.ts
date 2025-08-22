import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";

interface GetByIdAutomobileUseCaseDTO {
	id: string;
}

export class GetByIdAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: GetByIdAutomobileUseCaseDTO): Promise<Automobile | null> {
		return this.automobileRepository.getById(args.id);
	}
}