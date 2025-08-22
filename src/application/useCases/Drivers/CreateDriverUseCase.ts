import { Driver } from "../../../domain/entities/Driver";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { v4 as uuidv4 } from 'uuid';

export class CreateDriverUseCase {
	constructor(private driverRepository: IDriverRepository) {}

	async handle(name: string): Promise<Driver> {
		const driver = new Driver(uuidv4(), name);
		return this.driverRepository.create(driver);
	}
}