import { Driver } from "../entities/Driver";

export interface IDriverRepository {
	create(driver: Driver): Promise<Driver>;
	update(driver: Driver): Promise<Driver>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<Driver | null>;
	getByName(name: string): Promise<Driver | null>;
	getAll(): Promise<Driver[]>;
}