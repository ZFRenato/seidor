export class Driver {
	public id: string;
	public name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name.trim().toLowerCase();
	}
}