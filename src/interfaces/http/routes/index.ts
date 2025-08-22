import { Router } from 'express';
import driverRouter from './drivers.routes';
import automobileRouter from './automobile.routes';

const router = Router();

router.use('/drivers', driverRouter);
router.use('/automobiles', automobileRouter);

export default router;