import { Automobile } from "./Automobile";
import { Driver } from "./Driver";

export enum AllocationStatus {
	IN_PROGRESS = 'IN_PROGRESS',
	FINISHED = 'FINISHED',
}

export class Allocation {
	public id: string;
	public driver: Driver;
	public automobile: Automobile;
	public startDate: Date;
	public endDate: Date | null;
	public status: AllocationStatus;
	public description: string;

	constructor(
		id: string,
		driver: Driver,
		automobile: Automobile,
		startDate: Date,
		description: string,
		endDate?: Date,
		status?: AllocationStatus,
	) {
		this.id = id;
		this.driver = driver;
		this.automobile = automobile;
		this.startDate = startDate;
		this.description = description.trim().toLowerCase();
		this.endDate = endDate ?? null;
		this.status = status ?? AllocationStatus.IN_PROGRESS;
	}

}