import { NotFoundError } from "../../../domain/error/AppError";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { GetByIdAutomobileUseCase } from "./GetByIdAutomobileUseCase";
import { deleteAutomobileSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
}

export class DeleteAutomobileUseCase {
	constructor(
		private automobileRepository: IAutomobileRepository,
		private getByIdAutomobileUseCase: GetByIdAutomobileUseCase
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(deleteAutomobileSchema, args);
		const automobile = await this.getByIdAutomobileUseCase.handle(validatedData);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		await this.automobileRepository.delete(validatedData.id);
	}
}