import { Router } from 'express';
import { AutomobileController } from '../controllers/AutomobileController';

const router = Router();

router.post('/', AutomobileController.createAutomobile);
router.get('/', AutomobileController.listAutomobiles);
router.get('/:id', AutomobileController.getAutomobileById);
router.put('/:id', AutomobileController.updateAutomobile);
router.delete('/:id', AutomobileController.deleteAutomobile);

export default router;