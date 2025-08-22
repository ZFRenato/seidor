import { IDriverRepository } from "../../domain/repositories/DriverRepository";
import { Driver } from "../../domain/entities/Driver";
import { IPagination } from "../../util/IPagination";

export class InMemoryDriverRepository implements IDriverRepository {
	private drivers: Driver[] = [];

	async create(driver: Driver): Promise<Driver> {
		try {
			const existingDriver = this.drivers.find(d => d.id === driver.id);
			if (existingDriver) {
				throw new Error('Driver already exists');
			}
			this.drivers.push(driver);
			return driver;			
		} catch (error) {
			throw new Error(`InMemoryDriverRepository.create: ${error}`);
		}
	}

	async update(driver: Driver): Promise<Driver> {
		try {
			const existingDriver = this.drivers.find(d => d.id === driver.id);
			if (!existingDriver) {
				throw new Error('Driver not found');
			}
			existingDriver.name = driver.name;
			return existingDriver;
		} catch (error) {
			throw new Error(`InMemoryDriverRepository.update: ${error}`);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const index = this.drivers.findIndex(d => d.id === id);
			if (index === -1) {
				throw new Error('Driver not found');
			}
			this.drivers.splice(index, 1);
		} catch (error) {
			throw new Error(`InMemoryDriverRepository.delete: ${error}`);
		}
	}

	async getById(id: string): Promise<Driver | null> {
		try {
			return this.drivers.find(d => d.id === id) ?? null;
		} catch (error) {
			throw new Error(`InMemoryDriverRepository.getById: ${error}`);
		}
	}

	async list(filters: { name?: string, page?: number, limit?: number }): Promise<IPagination<Driver>> {
		try {
			const { name, page = 1, limit = 10 } = filters;
			const skip = (page - 1) * limit;
			const take = limit;

			const filteredDrivers = this.drivers.filter(d => name ? d.name.includes(name) : true);
			const total = filteredDrivers.length;
			const items = filteredDrivers.slice(skip, skip + take);
			return {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				items,
			};
		} catch (error) {
			throw new Error(`InMemoryDriverRepository.list: ${error}`);
		}
	}
}