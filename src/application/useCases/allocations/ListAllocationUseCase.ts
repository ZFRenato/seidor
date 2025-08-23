import { IAllocationRepository } from "../../../domain/repositories/allocationRepository";
import { Allocation, AllocationStatus } from "../../../domain/entities/Allocation";
import { IPagination } from "../../../util/IPagination";

export interface IListAllocationDTO {
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

	async handle(args: IListAllocationDTO): Promise<IPagination<Allocation>> {
		const { driverName, automobilePlate, ...rest } = args;
		return this.allocationRepository.list({
			...rest,
			...(args.driverName && { driver: { name: args.driverName.toLocaleLowerCase() } }),
			...(args.automobilePlate && { automobile: { plate: args.automobilePlate.toLocaleLowerCase() } }),
		});
	}
}