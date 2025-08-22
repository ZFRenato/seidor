import { Router } from 'express';
import { AllocationController } from '../controllers/AllocationController';

const router = Router();

router.post('/', AllocationController.createAllocation);
router.put('/:id', AllocationController.finishAllocation);
router.get('/', AllocationController.listAllocations);

export default router;