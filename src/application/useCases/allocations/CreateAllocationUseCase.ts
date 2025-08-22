import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { IAutomobileRepository } from "../../../domain/repositories/AutomobileRepository";
import { IDriverRepository } from "../../../domain/repositories/DriverRepository";
import { Allocation } from "../../../domain/entities/Allocation";
import { BadRequestError, NotFoundError } from "../../../domain/error/AppError";
import { v4 as uuidv4 } from 'uuid';

export interface ICreateAllocationDTO {
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

	async handle(args: ICreateAllocationDTO): Promise<Allocation> {
		const driver = await this.driverRepository.getById(args.driverId);
		if (!driver) {
			throw new NotFoundError('Driver not found');
		}
		const allocationInProgressByDriver = await this.allocationRepository
			.findByAllocationByDriverIdInProgress(args.driverId);
		if (allocationInProgressByDriver) {
			throw new BadRequestError('Driver already has an allocation in progress');
		}
		const automobile = await this.automobileRepository.getById(args.automobileId);
		if (!automobile) {
			throw new NotFoundError('Automobile not found');
		}
		const allocationInProgressByAutomobile = await this.allocationRepository
			.findByAllocationByAutomobileIdInProgress(args.automobileId);
		if (allocationInProgressByAutomobile) {
			throw new BadRequestError('Automobile already has an allocation in progress');
		}
		const allocation = new Allocation(uuidv4(), driver, automobile, new Date(), args.description);
		await this.allocationRepository.create(allocation);
		return allocation;
	}
}