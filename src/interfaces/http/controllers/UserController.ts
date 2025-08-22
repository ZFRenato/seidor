import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/useCases/CreateUserUseCase';
import { InMemoryUserRepository } from '../../../infrastructure/persistence/InMemoryUserRepository';

const userRepository = new InMemoryUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

export class UserController {
  static async createUser(req: Request, res: Response) {
    const { name, email } = req.body;
    try {
      const user = await createUserUseCase.execute(name, email);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
}
