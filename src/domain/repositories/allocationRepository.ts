import { IPagination } from "../../util/IPagination";
import { Allocation } from "../entities/Allocation";

export interface IFiltersListAllocations extends Partial<Omit<Allocation, 'startDate' | 'endDate'>> {
	page?: number;
	limit?: number;
}
export interface IAllocationRepository {
	create(allocation: Allocation): Promise<void>;
	getById(id: string): Promise<Allocation | null>;
	update(id: string, allocation: Partial<Allocation>): Promise<void>;
	list(args: IFiltersListAllocations): Promise<IPagination<Allocation>>;
	findByAllocationByDriverIdInProgress(driverId: string): Promise<Allocation | null>;
	findByAllocationByAutomobileIdInProgress(automobileId: string): Promise<Allocation | null>;
}