import { Allocation, AllocationStatus } from "../../domain/entities/Allocation";
import { IAllocationRepository, IFiltersListAllocations } from "../../domain/repositories/allocationRepository";
import { IPagination } from "../../util/IPagination";


export class InMemoryAllocationRepository implements IAllocationRepository {
	private allocations: Allocation[] = [];
	private static instance: InMemoryAllocationRepository;
	private constructor() {}
	public static getInstance(): InMemoryAllocationRepository {
		if (!InMemoryAllocationRepository.instance) {
			InMemoryAllocationRepository.instance = new InMemoryAllocationRepository();
		}
		return InMemoryAllocationRepository.instance;
	}

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
			return Object.entries(filters).every(([key, value]) => {
				if (key && value && typeof value === 'string') {
					return allocation[key as keyof Allocation] === value;
				}
				if (key && value && typeof value === 'object') {
					const allocationValue = allocation[key as keyof Allocation];
					if (allocationValue && typeof allocationValue === 'object') {
						return Object.entries(value).every(([subKey, subValue]) => {
							// @ts-ignore: dynamic nested property access for filter comparison
							return allocationValue[subKey] === subValue;
						});
					}
					return false;
				}
				return true;
			});
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

	async findByAllocationByDriverIdInProgress(driverId: string): Promise<Allocation | null> {
		return this.allocations.find(allocation => allocation.driver.id === driverId && allocation.status === AllocationStatus.IN_PROGRESS) ?? null;
	}

	async findByAllocationByAutomobileIdInProgress(automobileId: string): Promise<Allocation | null> {
		return this.allocations.find(allocation => allocation.automobile.id === automobileId && allocation.status === AllocationStatus.IN_PROGRESS) ?? null;
	}
}