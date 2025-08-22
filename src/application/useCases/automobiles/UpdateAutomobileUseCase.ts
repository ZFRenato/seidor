import { Automobile } from "../../../domain/entities/Automobile";
import { NotFoundError } from "../../../domain/error/AppError";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { GetByIdAutomobileUseCase } from "./GetByIdAutomobileUseCase";

interface UpdateAutomobileUseCaseDTO {
	id: string;
	props: Partial<Automobile>;
}

export class UpdateAutomobileUseCase {
	constructor(
		private automobileRepository: IAutomobileRepository,
		private getByIdAutomobileUseCase: GetByIdAutomobileUseCase,
	) {}

	async handle(args: UpdateAutomobileUseCaseDTO): Promise<void> {
		const automobile = await this.getByIdAutomobileUseCase.handle(args);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		await this.automobileRepository.update(args.id, args.props);
	}
}