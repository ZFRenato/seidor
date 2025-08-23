import { Request, Response } from 'express';
import { response } from '../util/responseHttp';
import { NotFoundError } from '../../../domain/error/AppError';
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
		const { name } = req.body;
		try {
			const driver = await createDriverUseCase.handle(name);
			return response.created(res, driver);
		} catch (error) {
			return response.internalServerError(res, error);
		}
	}
	static async deleteDriver(req: Request, res: Response) {
		const { id } = req.params;
			await deleteDriverUseCase.handle(id);
			return response.ok(res, { message: `Driver ${id} deleted successfully` });
	}
	static async getDriverById(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const driver = await getDriverByIdUseCase.handle(id);
			if (!driver) {
				return response.notFound(res, { message: `Driver ${id} not found` });
			}
			return response.ok(res, driver);
		} catch (error) {
			return response.internalServerError(res, error);
		}
	}
	static async updateDriver(req: Request, res: Response) {
		const { id } = req.params;
		const { name } = req.body;
		try {
			await updateDriverUseCase.handle({ id, props: { name } });
			return response.ok(res, { message: `Driver ${id} updated successfully` });
		} catch (error) {
			if (error instanceof NotFoundError) {
				return response.notFound(res, { message: error.message });
			} else {
				return response.internalServerError(res, error);
			}
		}
	}

	static async listDrivers(req: Request, res: Response) {
		const { name, page, limit } = req.query as { name?: string, page?: number, limit?: number };
		try {
			const drivers = await listDriverUseCase.handle({ name, page, limit });
			return response.ok(res, drivers);
		} catch (error) {
			return response.internalServerError(res, error);
		}
	}
}