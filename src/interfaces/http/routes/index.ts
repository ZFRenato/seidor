import { Router } from 'express';
import driverRouter from './drivers.routes';
import automobileRouter from './automobile.routes';
import allocationRouter from './allocation.routes';

const router = Router();

router.use('/drivers', driverRouter);
router.use('/automobiles', automobileRouter);
router.use('/allocations', allocationRouter);

export default router;