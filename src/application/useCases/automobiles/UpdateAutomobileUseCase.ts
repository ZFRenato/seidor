import { NotFoundError } from "../../../domain/error/AppError";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { GetByIdAutomobileUseCase } from "./GetByIdAutomobileUseCase";
import { updateAutomobileSchema } from "./automobileSchemaInput";
import { validator } from "../../../domain/validation";

interface DTO {
	id: string;
	brand?: string;
	color?: string;
	plate?: string;
}

export class UpdateAutomobileUseCase {
	constructor(
		private automobileRepository: IAutomobileRepository,
		private getByIdAutomobileUseCase: GetByIdAutomobileUseCase,
	) {}

	async handle(args: DTO): Promise<void> {
		const validatedData = await validator(updateAutomobileSchema, args);
		const { id, ...props } = validatedData;
		const automobile = await this.getByIdAutomobileUseCase.handle({ id });
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		await this.automobileRepository.update(id, props);
	}
}