import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { Allocation } from "../../../domain/entities/Allocation";
import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";
import { v4 as uuidv4 } from 'uuid';
import { createAllocationSchema } from "./allocationSchemaImput";
import { validator } from "../../../domain/validation";

export interface DTO {
	driverId: string;
	automobileId: string;
	description: string;
}


export class CreateAllocationUseCase {
	constructor(
		private readonly allocationRepository: IAllocationRepository,
		private readonly driverRepository: IDriverRepository,
		private readonly automobileRepository: IAutomobileRepository,
	) {}

	async handle(args: DTO): Promise<Allocation> {
		const validatedData = await validator(createAllocationSchema, args);
		const { driverId, automobileId, description } = validatedData;
		const driver = await this.driverRepository.getById(driverId);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		const allocationInProgressByDriver = await this.allocationRepository
			.findByAllocationByDriverIdInProgress(driverId);
		if (allocationInProgressByDriver) {
			throw new BadRequestError('Driver already has an allocation in progress');
		}
		const automobile = await this.automobileRepository.getById(automobileId);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		const allocationInProgressByAutomobile = await this.allocationRepository
			.findByAllocationByAutomobileIdInProgress(automobileId);
		if (allocationInProgressByAutomobile) {
			throw new BadRequestError('Automobile already has an allocation in progress');
		}
		const allocation = new Allocation(uuidv4(), driver, automobile, new Date(), description);
		await this.allocationRepository.create(allocation);
		return allocation;
	}
}