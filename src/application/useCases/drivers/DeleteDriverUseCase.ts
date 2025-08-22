import { NotFoundError } from "../../../domain/error/AppError";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { GetDriverByIdUseCase } from "./GetDriverByIdUseCase";

export class DeleteDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository,
		private getDriverByIdUseCase: GetDriverByIdUseCase
	) {}

	async handle(id: string): Promise<void> {
		const driver = await this.getDriverByIdUseCase.handle(id);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		await this.driverRepository.delete(id);
	}
}