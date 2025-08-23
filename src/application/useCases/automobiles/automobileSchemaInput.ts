import Joi from "joi";

export const createAutomobileSchema = Joi.object({
	brand: Joi.string().min(3).max(20).required(),
	color: Joi.string().min(3).max(20).required(),
	plate: Joi.string().replace(/[^A-Za-z0-9]/g, '').min(7).max(7).required(),
});

export const deleteAutomobileSchema = Joi.object({
	id: Joi.string().required(),
});

export const getAutomobileByIdSchema = Joi.object({
	id: Joi.string().required(),
});

export const updateAutomobileSchema = Joi.object({
	id: Joi.string().required(),
	brand: Joi.string().min(3).max(20).optional(),
	color: Joi.string().min(3).max(20).optional(),
	plate: Joi.string().replace(/[^A-Za-z0-9]/g, '').min(7).max(7).optional(),
});

export const listAutomobileSchema = Joi.object({
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	brand: Joi.string().min(3).max(20).optional(),
	color: Joi.string().min(3).max(20).optional(),
	plate: Joi.string().replace(/[^A-Za-z0-9]/g, '').min(7).max(7).optional(),
}).prefs({ convert: true });