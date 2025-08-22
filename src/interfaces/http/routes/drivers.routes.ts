import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';

const driverRouter = Router();

driverRouter.post('/', DriverController.createDriver);
driverRouter.get('/', DriverController.listDrivers);
driverRouter.delete('/:id', DriverController.deleteDriver);
driverRouter.get('/:id', DriverController.getDriverById);
driverRouter.put('/:id', DriverController.updateDriver);

export default driverRouter;