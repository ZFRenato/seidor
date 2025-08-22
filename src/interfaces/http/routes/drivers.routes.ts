import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';

const driverRouter = Router();

driverRouter.post('/', DriverController.createDriver);

export default driverRouter;