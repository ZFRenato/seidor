import Joi from "joi";
import { AllocationStatus } from "../../../domain/entities/Allocation";

export const createAllocationSchema = Joi.object({
	driverId: Joi.string().required(),
	automobileId: Joi.string().required(),
	description: Joi.string().min(5).max(100).required(),
});

export const finishAllocationSchema = Joi.object({
	id: Joi.string().required(),
});

export const listAllocationSchema = Joi.object({
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	driverName: Joi.string().min(2).max(100).optional(),
	automobilePlate: Joi.string().replace(/[^A-Za-z0-9]/g, '').min(7).max(7).optional(),
	status: Joi.string().valid(AllocationStatus.IN_PROGRESS, AllocationStatus.FINISHED).optional(),
}).prefs({ convert: true });