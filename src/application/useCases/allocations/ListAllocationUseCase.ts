import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { Allocation, AllocationStatus } from "../../../domain/entities/Allocation";
import { IPagination } from "../../../util/IPagination";
import { Driver } from "../../../domain/entities/Driver";
import { Automobile } from "../../../domain/entities/Automobile";
import { listAllocationSchema } from "./allocationSchemaImput";
import { validator } from "../../../domain/validation";

export interface DTO {
	page?: number;
	limit?: number;
	driverName?: string;
	automobilePlate?: string;	
	status?: AllocationStatus;
}

export class ListAllocationUseCase {
	constructor(
		private readonly allocationRepository: IAllocationRepository
	) {}

	async handle(args: DTO): Promise<IPagination<Allocation>> {
		const validatedData = await validator(listAllocationSchema, args);
		const { driverName, automobilePlate, ...rest } = validatedData;
		return this.allocationRepository.list({
			...rest,
			...(args.driverName && { driver: { name: args.driverName } as Driver }),
			...(args.automobilePlate && { automobile: { plate: args.automobilePlate } as Automobile }),
		});
	}
}