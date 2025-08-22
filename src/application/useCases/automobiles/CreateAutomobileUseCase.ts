import { Automobile } from "../../../domain/entities/Automobile";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { v4 as uuidv4 } from 'uuid';

interface CreateAutomobileUseCaseDTO {
	brand: string;
	color: string;
	plate: string;
}

export class CreateAutomobileUseCase {
	constructor(private automobileRepository: IAutomobileRepository) {}

	async handle(args: CreateAutomobileUseCaseDTO): Promise<Automobile> {
		const automobile = new Automobile(uuidv4(), args.brand, args.color, args.plate);
		return this.automobileRepository.create(automobile);
	}
}