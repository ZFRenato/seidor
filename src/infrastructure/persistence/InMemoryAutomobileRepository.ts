import { IAutomobileRepository } from "../../domain/repositories/AutomobileRepository";
import { Automobile } from "../../domain/entities/Automobile";
import { IPagination } from "../../util/IPagination";

export class InMemoryAutomobileRepository implements IAutomobileRepository {
	private automobiles: Automobile[] = [];
	private static instance: InMemoryAutomobileRepository;
	private constructor() {}
	public static getInstance(): InMemoryAutomobileRepository {
		if (!InMemoryAutomobileRepository.instance) {
			InMemoryAutomobileRepository.instance = new InMemoryAutomobileRepository();
		}
		return InMemoryAutomobileRepository.instance;
	}

	async create(automobile: Automobile): Promise<Automobile> {
		this.automobiles.push(automobile);
		return automobile;
	}

	async update(id: string, props: Partial<Automobile>): Promise<Automobile> {
		const automobile = this.automobiles.find(a => a.id === id);
		if (!automobile) {
			throw new Error('Automobile not found');
		}
		Object.assign(automobile, props);

		return automobile;
	}

	async delete(id: string): Promise<void> {
		const index = this.automobiles.findIndex(a => a.id === id);
		if (index === -1) {
			throw new Error('Automobile not found');
		}
		this.automobiles.splice(index, 1);
	}

	async getById(id: string): Promise<Automobile | null> {
		return this.automobiles.find(a => a.id === id) || null;
	}
	
	async list(filters: { brand?: string, color?: string, plate?: string, page?: number, limit?: number }): Promise<IPagination<Automobile>> {
		const { brand, color, plate, page = 1, limit = 10 } = filters;
		const skip = (page - 1) * limit;
		const take = limit;
		const filteredAutomobiles = this.automobiles.filter(a => {
			if (brand && a.brand.toLowerCase() !== brand.toLowerCase()) return false;
			if (color && a.color.toLowerCase() !== color.toLowerCase()) return false;
			if (plate && a.plate.toLowerCase() !== plate.toLowerCase()) return false;
			return true;
		});
		const total = filteredAutomobiles.length;
		const items = filteredAutomobiles.slice(skip, skip + take);
		return {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / take),
			items,
		};
	}
}