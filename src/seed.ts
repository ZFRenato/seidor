import { InMemoryDriverRepository } from './infrastructure/persistence/InMenoryDriverRepository';
import { InMemoryAutomobileRepository } from './infrastructure/persistence/InMemoryAutomobileRepository';
import { InMemoryAllocationRepository } from './infrastructure/persistence/InMenoryAllocationRepository';
import { CreateDriverUseCase } from './application/useCases/drivers/CreateDriverUseCase';
import { CreateAutomobileUseCase } from './application/useCases/automobiles/CreateAutomobileUseCase';
import { CreateAllocationUseCase } from './application/useCases/allocations/CreateAllocationUseCase';

export async function runSeed(): Promise<void> {
	const driverRepo = InMemoryDriverRepository.getInstance();
	const autoRepo = InMemoryAutomobileRepository.getInstance();
	const allocationRepo = InMemoryAllocationRepository.getInstance();

	const createDriver = new CreateDriverUseCase(driverRepo);
	const createAutomobile = new CreateAutomobileUseCase(autoRepo);
	const createAllocation = new CreateAllocationUseCase(allocationRepo, driverRepo, autoRepo);

	// Drivers
	const driverAlice = await createDriver.handle({ name: 'Alice' });
	const driverBob = await createDriver.handle({ name: 'Bob' });
	const driverCarol = await createDriver.handle({ name: 'Carol' });

	// Automobiles
	const autoUno = await createAutomobile.handle({ brand: 'Fiat', color: 'Prata', plate: 'ABC1D23' });
	const autoGol = await createAutomobile.handle({ brand: 'VW', color: 'Preto', plate: 'EFG4H56' });
	const autoOnix = await createAutomobile.handle({ brand: 'GM', color: 'Branco', plate: 'IJK7L89' });

	// Allocation válida (um em progresso)
	await createAllocation.handle({ driverId: driverAlice.id, automobileId: autoUno.id, description: 'Entrega centro' });
	await createAllocation.handle({ driverId: driverBob.id, automobileId: autoGol.id, description: 'Entrega na praia' });

	console.log('Seed executado com sucesso.');
}

if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
	runSeed().catch((err) => {
		console.error('Erro ao executar seed:', err);
		process.exit(1);
	});
}
