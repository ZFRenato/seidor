import Joi from 'joi';

export const createDriverSchema = Joi.object({
	name: Joi.string().required(),
});

export const deleteDriverSchema = Joi.object({
	id: Joi.string().required(),
});

export const getDriverByIdSchema = Joi.object({
	id: Joi.string().required(),
});

export const updateDriverSchema = Joi.object({
	id: Joi.string().required(),
	name: Joi.string().optional(),
});

export const listDriverSchema = Joi.object({
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	name: Joi.string().optional(),
}).prefs({ convert: true });