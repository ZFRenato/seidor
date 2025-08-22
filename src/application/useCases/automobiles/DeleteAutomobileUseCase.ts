import { NotFoundError } from "../../../domain/error/AppError";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { GetByIdAutomobileUseCase } from "./GetByIdAutomobileUseCase";

interface DeleteAutomobileUseCaseDTO {
	id: string;
}

export class DeleteAutomobileUseCase {
	constructor(
		private automobileRepository: IAutomobileRepository,
		private getByIdAutomobileUseCase: GetByIdAutomobileUseCase
	) {}

	async handle(args: DeleteAutomobileUseCaseDTO): Promise<void> {
		const automobile = await this.getByIdAutomobileUseCase.handle(args);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		await this.automobileRepository.delete(args.id);
	}
}