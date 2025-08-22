import { IPagination } from "../../util/IPagination";
import { Allocation, AllocationStatus } from "../entities/Allocation";
import { Automobile } from "../entities/Automobile";
import { Driver } from "../entities/Driver";

export interface IFiltersListAllocations extends Partial<Driver>, Partial<Automobile> {
	status?: AllocationStatus;
	page?: number;
	limit?: number;
}
export interface IAllocationRepository {
	create(allocation: Allocation): Promise<void>;
	getById(id: string): Promise<Allocation | null>;
	update(id: string, allocation: Partial<Allocation>): Promise<void>;
	list(args: IFiltersListAllocations): Promise<IPagination<Allocation>>;
}