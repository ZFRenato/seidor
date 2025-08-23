import { Request, Response } from 'express';
import { response } from '../util/responseHttp';
import { CreateDriverUseCase } from '../../../application/useCases/drivers/CreateDriverUseCase';
import { GetDriverByIdUseCase } from '../../../application/useCases/drivers/GetDriverByIdUseCase';
import { DeleteDriverUseCase } from '../../../application/useCases/drivers/DeleteDriverUseCase';
import { InMemoryDriverRepository } from '../../../infrastructure/persistence/InMenoryDriverRepository';
import { UpdateDriverUseCase } from '../../../application/useCases/drivers/UpdateDriverUseCase';
import { ListDriverUseCase } from '../../../application/useCases/drivers/ListDriverUseCase';

const driverRepository = InMemoryDriverRepository.getInstance();
const getDriverByIdUseCase = new GetDriverByIdUseCase(driverRepository);
const createDriverUseCase = new CreateDriverUseCase(driverRepository);
const deleteDriverUseCase = new DeleteDriverUseCase(driverRepository, getDriverByIdUseCase);
const updateDriverUseCase = new UpdateDriverUseCase(driverRepository, getDriverByIdUseCase);
const listDriverUseCase = new ListDriverUseCase(driverRepository);

export class DriverController {
	static async createDriver(req: Request, res: Response) {
		const driver = await createDriverUseCase.handle(req.body);
		return response.created(res, driver);
	}
	static async deleteDriver(req: Request, res: Response) {
		const { id } = req.params;
		await deleteDriverUseCase.handle({ id });
		return response.ok(res, { message: `Driver ${id} deleted successfully` });
	}
	static async getDriverById(req: Request, res: Response) {
		const { id } = req.params;
		const driver = await getDriverByIdUseCase.handle({ id });
		if (!driver) {
			return response.notFound(res, { message: `Driver ${id} not found` });
		}
		return response.ok(res, driver);
	}
	static async updateDriver(req: Request, res: Response) {
		const { id } = req.params;
		const { name } = req.body;
		await updateDriverUseCase.handle({ id, name });
		return response.ok(res, { message: `Driver ${id} updated successfully` });
	}

	static async listDrivers(req: Request, res: Response) {
		const drivers = await listDriverUseCase.handle(req.query);
		return response.ok(res, drivers);
	}
}