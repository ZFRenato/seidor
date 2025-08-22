import { Driver } from "../../../domain/entities/Driver";
import { NotFoundError } from "../../../domain/error/AppError";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { GetDriverByIdUseCase } from "./GetDriverByIdUseCase";

export class UpdateDriverUseCase {
	constructor(
		private driverRepository: IDriverRepository,
		private getDriverByIdUseCase: GetDriverByIdUseCase
	) {}

	async handle(args: { id: string, props: Partial<Driver> }): Promise<void> {
		const driver = await this.getDriverByIdUseCase.handle(args.id);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		await this.driverRepository.update(args.id, args.props);
	}
}