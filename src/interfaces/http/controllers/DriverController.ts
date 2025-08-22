import { Request, Response } from 'express';
import { CreateDriverUseCase } from '../../../application/useCases/Drivers/CreateDriverUseCase';
import { InMemoryDriverRepository } from '../../../infrastructure/persistence/InMenoryDriverRepository';
import { response } from '../util/responseHttp';

const driverRepository = new InMemoryDriverRepository();
const createDriverUseCase = new CreateDriverUseCase(driverRepository);

export class DriverController {
	static async createDriver(req: Request, res: Response) {
		const { name } = req.body;
		try {
			const driver = await createDriverUseCase.handle(name);
			response.created(res, driver);
		} catch (error) {
			response.internalServerError(res, error);
		}
	}
}