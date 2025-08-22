import { Allocation } from "../../domain/entities/Allocation";
import { IAllocationRepository, IFiltersListAllocations } from "../../domain/repositories/allocationRepository";
import { IPagination } from "../../util/IPagination";


export class InMemoryAllocationRepository implements IAllocationRepository {
	private allocations: Allocation[] = [];

	async create(allocation: Allocation): Promise<void> {
		this.allocations.push(allocation);
	}

	async getById(id: string): Promise<Allocation | null> {
		return this.allocations.find(allocation => allocation.id === id) ?? null;
	}

	// I chose not to use Object.assign because of the Driver and automobile props.
	async update(id: string, allocation: Partial<Allocation>): Promise<void> {
		const index = this.allocations.findIndex(allocation => allocation.id === id);
		if (index === -1) {
			throw new Error('Allocation not found');
		}
		this.allocations[index] = { ...this.allocations[index], ...allocation };
	}

	async list(args: IFiltersListAllocations): Promise<IPagination<Allocation>> {
		const { page = 1, limit = 10, ...filters } = args;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const allocations = this.allocations.filter(allocation => {
			return Object.entries(filters).every(([key, value]) => allocation[key as keyof Allocation] === value);
		});

		const total = allocations.length;
		const paginatedAllocations = allocations.slice(startIndex, endIndex);
		return {
			items: paginatedAllocations,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}