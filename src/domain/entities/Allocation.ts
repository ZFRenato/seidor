export class Allocation {
	public id: string;
	public driverId: string;
	public automobileId: string;
	public startDate: Date;
	public endDate: Date | null;
	public description: string;

	constructor(id: string, driverId: string, automobileId: string, startDate: Date, description: string, endDate?: Date) {
		this.id = id;
		this.driverId = driverId;
		this.automobileId = automobileId;
		this.startDate = startDate;
		this.description = description.trim().toLowerCase();
		this.endDate = endDate ?? null;
	}

}