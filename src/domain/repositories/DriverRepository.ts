import { IPagination } from "../../util/IPagination";
import { Driver } from "../entities/Driver";

export interface IDriverRepository {
	create(driver: Driver): Promise<Driver>;
	update(id: string, props: Partial<Driver>): Promise<Driver>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<Driver | null>;
	list(filters: { name?: string, page?: number, limit?: number }): Promise<IPagination<Driver>>;
}