import { Request, Response } from 'express';
import { response } from '../util/responseHttp';
import { CreateAutomobileUseCase } from '../../../application/useCases/automobiles/CreateAutomobileUseCase';
import { GetByIdAutomobileUseCase } from '../../../application/useCases/automobiles/GetByIdAutomobileUseCase';
import { DeleteAutomobileUseCase } from '../../../application/useCases/automobiles/DeleteAutomobileUseCase';
import { UpdateAutomobileUseCase } from '../../../application/useCases/automobiles/UpdateAutomobileUseCase';
import { ListAutomobileUseCase } from '../../../application/useCases/automobiles/ListAutomobileUseCase';
import { InMemoryAutomobileRepository } from '../../../infrastructure/persistence/InMemoryAutomobileRepository';


const automobileRepository = InMemoryAutomobileRepository.getInstance();
const getByIdAutomobileUseCase = new GetByIdAutomobileUseCase(automobileRepository);
const createAutomobileUseCase = new CreateAutomobileUseCase(automobileRepository);
const deleteAutomobileUseCase = new DeleteAutomobileUseCase(automobileRepository, getByIdAutomobileUseCase);
const updateAutomobileUseCase = new UpdateAutomobileUseCase(automobileRepository, getByIdAutomobileUseCase);
const listAutomobileUseCase = new ListAutomobileUseCase(automobileRepository);

export class AutomobileController {
	static async createAutomobile(req: Request, res: Response) {
		const { brand, color, plate } = req.body;
		const automobile = await createAutomobileUseCase.handle({ brand, color, plate });
		return response.created(res, automobile);
	}

	static async getAutomobileById(req: Request, res: Response) {
		const { id } = req.params;
		const automobile = await getByIdAutomobileUseCase.handle({ id });
		if (!automobile) {
			return response.notFound(res, { message: 'Automobile not found' });
		}
		return response.ok(res, automobile);
	}

	static async updateAutomobile(req: Request, res: Response) {
		const { id } = req.params;
		const { brand, color, plate } = req.body;
		await updateAutomobileUseCase.handle({ id, props: { brand, color, plate } });
		return response.ok(res, { message: 'Automobile updated successfully' });
	}

	static async listAutomobiles(req: Request, res: Response) {
		const { brand, color, plate, page, limit } = req.query as { brand?: string, color?: string, plate?: string, page?: number, limit?: number };
		const automobiles = await listAutomobileUseCase.handle({ filters: { brand, color, plate, page, limit } });
		return response.ok(res, automobiles);
	}

	static async deleteAutomobile(req: Request, res: Response) {
		const { id } = req.params;	
		await deleteAutomobileUseCase.handle({ id });
		return response.ok(res, { message: 'Automobile deleted successfully' });
	}
}

	