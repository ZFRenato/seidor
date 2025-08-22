import { Router } from 'express';
import driverRouter from './drivers.routes';

const router = Router();

router.use('/drivers', driverRouter);

export default router;