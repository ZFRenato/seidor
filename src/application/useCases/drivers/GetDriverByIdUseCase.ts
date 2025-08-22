import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";

export class GetDriverByIdUseCase {
	constructor(private driverRepository: IDriverRepository) {}

	async handle(id: string): Promise<Driver | null> {
		return this.driverRepository.getById(id);
	}
}