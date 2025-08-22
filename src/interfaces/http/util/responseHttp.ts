import { Response } from 'express';


export const response = {
	ok: <T>(res: Response, data: T) => {
		res.status(200).json({
			success: true,
			timestamp: new Date().toISOString(),
			data,
		});
	},
	created: <T>(res: Response, data: T) => {
		res.status(201).json({
				success: true,
				timestamp: new Date().toISOString(),
				data,
		});
	},
	badRequest: <T>(res: Response, data: T) => {
		res.status(400).json({
				success: false,
				timestamp: new Date().toISOString(),
				data,
		});
	},
	notFound: <T>(res: Response, data: T) => {
		res.status(404).json({
				success: false,
				timestamp: new Date().toISOString(),
				data,
		});
	},
	internalServerError: <T>(res: Response, data: T) => {
		res.status(500).json({
				success: false,
				timestamp: new Date().toISOString(),
				data,
		});
	}
};