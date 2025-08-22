export class Automobile {
	public id: string;
	public brand: string;
	public color: string;
	public plate: string;

	constructor(id: string, brand: string, color: string, plate: string) {
		this.id = id;
		this.brand = brand.trim().toLowerCase();
		this.color = color.trim().toLowerCase();
		this.plate = plate.trim().toLowerCase();
	}
}