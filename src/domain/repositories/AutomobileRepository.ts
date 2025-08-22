import { IPagination } from "../../util/IPagination";
import { Automobile } from "../entities/Automobile";

export interface IAutomobileRepository {
	create(automobile: Automobile): Promise<Automobile>;
	update(id: string, props: Partial<Automobile>): Promise<Automobile>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<Automobile | null>;
	list(filters: { brand?: string, color?: string, plate?: string, page?: number, limit?: number }): Promise<IPagination<Automobile>>;
}