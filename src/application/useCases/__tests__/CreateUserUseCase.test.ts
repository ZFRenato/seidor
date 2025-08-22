import { CreateUserUseCase } from '../CreateUserUseCase';
import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';

class MockUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    return user;
  }
}

describe('CreateUserUseCase', () => {
  it('should create a user with given name and email', async () => {
    const mockRepo = new MockUserRepository();
    const useCase = new CreateUserUseCase(mockRepo);

    const name = 'Test User';
    const email = 'test@example.com';
    const user = await useCase.execute(name, email);

    expect(user).toBeDefined();
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.id).toBeDefined();
  });
});
