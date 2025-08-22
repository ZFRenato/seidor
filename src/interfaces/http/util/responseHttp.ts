export const response = {
	ok: <T>(data: T) => {
		return {
			statusCode: 200,
			body: {
				success: true,
				timestamp: new Date().toISOString(),
				data,
			}
		};
	},
	created: <T>(data: T) => {
		return {
			statusCode: 201,
			body: {
				success: true,
				timestamp: new Date().toISOString(),
				data,
			}
		};
	},
	badRequest: <T>(data: T) => {
		return {
			statusCode: 400,
			body: {
				success: false,
				timestamp: new Date().toISOString(),
				data,
			}
		};
	},
	notFound: <T>(data: T) => {
		return {
			statusCode: 404,
			body: {
				success: false,
				timestamp: new Date().toISOString(),
				data,
			}
		};
	},
	internalServerError: <T>(data: T) => {
		return {
			statusCode: 500,
			body: {
				success: false,
				timestamp: new Date().toISOString(),
				data,
			}
		};
	}
};