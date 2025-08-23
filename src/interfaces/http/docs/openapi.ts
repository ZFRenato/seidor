import { OpenAPIV3_1 } from 'openapi-types';

export const openapiDoc: OpenAPIV3_1.Document = {
	openapi: '3.0.3',
	info: {
		title: 'Seidor API',
		description: 'API para gestão de Motoristas, Automóveis e Alocações',
		version: '1.0.0',
	},
	servers: [
		{ url: 'http://localhost:3000/api/v1' },
	],
	components: {
		schemas: {
			ApiResponse: {
				type: 'object',
				required: ['success', 'timestamp', 'data'],
				properties: {
					success: { type: 'boolean' },
					timestamp: { type: 'string', format: 'date-time' },
					data: { nullable: true },
				},
			},
			Message: {
				type: 'object',
				required: ['message'],
				properties: { message: { type: 'string' } },
			},
			Driver: {
				type: 'object',
				required: ['id', 'name'],
				properties: {
					id: { type: 'string', format: 'uuid' },
					name: { type: 'string' },
				},
			},
			Automobile: {
				type: 'object',
				required: ['id', 'brand', 'color', 'plate'],
				properties: {
					id: { type: 'string', format: 'uuid' },
					brand: { type: 'string' },
					color: { type: 'string' },
					plate: { type: 'string', pattern: '^[a-z0-9]{7}$', description: 'Placa normalizada sem traços/pontos' },
				},
			},
			AllocationStatus: {
				type: 'string',
				enum: ['IN_PROGRESS', 'FINISHED'],
			},
			Allocation: {
				type: 'object',
				required: ['id', 'driver', 'automobile', 'startDate', 'status', 'description'],
				properties: {
					id: { type: 'string', format: 'uuid' },
					driver: { $ref: '#/components/schemas/Driver' },
					automobile: { $ref: '#/components/schemas/Automobile' },
					startDate: { type: 'string', format: 'date-time' },
					endDate: { type: 'string', format: 'date-time', nullable: true },
					status: { $ref: '#/components/schemas/AllocationStatus' },
					description: { type: 'string' },
				},
			},
			PaginationOfDriver: {
				type: 'object',
				required: ['page', 'limit', 'total', 'totalPages', 'items'],
				properties: {
					page: { type: 'integer' },
					limit: { type: 'integer' },
					total: { type: 'integer' },
					totalPages: { type: 'integer' },
					items: { type: 'array', items: { $ref: '#/components/schemas/Driver' } },
				},
			},
			PaginationOfAutomobile: {
				type: 'object',
				required: ['page', 'limit', 'total', 'totalPages', 'items'],
				properties: {
					page: { type: 'integer' },
					limit: { type: 'integer' },
					total: { type: 'integer' },
					totalPages: { type: 'integer' },
					items: { type: 'array', items: { $ref: '#/components/schemas/Automobile' } },
				},
			},
			PaginationOfAllocation: {
				type: 'object',
				required: ['page', 'limit', 'total', 'totalPages', 'items'],
				properties: {
					page: { type: 'integer' },
					limit: { type: 'integer' },
					total: { type: 'integer' },
					totalPages: { type: 'integer' },
					items: { type: 'array', items: { $ref: '#/components/schemas/Allocation' } },
				},
			},
			BadRequest: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{
						properties: { data: { $ref: '#/components/schemas/Message' } },
					},
				],
			},
			NotFound: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{ properties: { data: { $ref: '#/components/schemas/Message' } } },
				],
			},
			InternalError: {
				allOf: [
					{ $ref: '#/components/schemas/ApiResponse' },
					{ properties: { data: { $ref: '#/components/schemas/Message' } } },
				],
			},
		},
	},
	paths: {
		'/drivers': {
			post: {
				summary: 'Cria um driver',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['name'],
								properties: { name: { type: 'string' } },
							},
							examples: {
								default: { value: { name: 'John Doe' } },
							},
						},
					},
				},
				responses: {
					'201': {
						description: 'Criado',
						content: {
							'application/json': {
								schema: {
									allOf: [
										{ $ref: '#/components/schemas/ApiResponse' },
										{ properties: { data: { $ref: '#/components/schemas/Driver' } } },
									],
								},
								examples: {
									default: {
										value: {
											success: true,
											timestamp: '2024-07-01T12:00:00.000Z',
											data: { id: 'uuid', name: 'john doe' },
										},
									},
								},
							},
						},
					},
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			get: {
				summary: 'Lista drivers',
				parameters: [
					{ in: 'query', name: 'name', schema: { type: 'string' } },
					{ in: 'query', name: 'page', schema: { type: 'integer' } },
					{ in: 'query', name: 'limit', schema: { type: 'integer' } },
				],
				responses: {
					'200': {
						description: 'OK',
						content: {
							'application/json': {
								schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/PaginationOfDriver' } } } ] },
								examples: {
									default: { value: { success: true, timestamp: '2024-07-01T12:00:00.000Z', data: { page: 1, limit: 10, total: 1, totalPages: 1, items: [ { id: 'uuid', name: 'john doe' } ] } } },
								},
							},
						},
					},
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
		'/drivers/{id}': {
			get: {
				summary: 'Obtém driver por ID',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Driver' } } } ] } } } },
					'404': { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			put: {
				summary: 'Atualiza driver',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } }, examples: { default: { value: { name: 'John Updated' } } } } } },
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Message' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			delete: {
				summary: 'Exclui driver',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Message' } } } ] } } } },
					'404': { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
		'/automobiles': {
			post: {
				summary: 'Cria automóvel',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['brand', 'color', 'plate'],
								properties: {
									brand: { type: 'string', minLength: 2, maxLength: 20 },
									color: { type: 'string', minLength: 2, maxLength: 20 },
									plate: { type: 'string', pattern: '^[A-Za-z0-9]{7}$' },
								},
							},
							examples: { default: { value: { brand: 'Toyota', color: 'prata', plate: 'ABC1234' } } },
						},
					},
				},
				responses: {
					'201': { description: 'Criado', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Automobile' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			get: {
				summary: 'Lista automóveis',
				parameters: [
					{ in: 'query', name: 'brand', schema: { type: 'string' } },
					{ in: 'query', name: 'color', schema: { type: 'string' } },
					{ in: 'query', name: 'plate', schema: { type: 'string', pattern: '^[A-Za-z0-9]{7}$' } },
					{ in: 'query', name: 'page', schema: { type: 'integer' } },
					{ in: 'query', name: 'limit', schema: { type: 'integer' } },
				],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/PaginationOfAutomobile' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
		'/automobiles/{id}': {
			get: {
				summary: 'Obtém automóvel por ID',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Automobile' } } } ] } } } },
					'404': { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			put: {
				summary: 'Atualiza automóvel',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { brand: { type: 'string' }, color: { type: 'string' }, plate: { type: 'string', pattern: '^[A-Za-z0-9]{7}$' } } } } } },
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Message' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			delete: {
				summary: 'Exclui automóvel',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Message' } } } ] } } } },
					'404': { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
		'/allocations': {
			post: {
				summary: 'Cria alocação',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { type: 'object', required: ['driverId', 'automobileId', 'description'], properties: { driverId: { type: 'string', format: 'uuid' }, automobileId: { type: 'string', format: 'uuid' }, description: { type: 'string', minLength: 5, maxLength: 100 } } },
							examples: { default: { value: { driverId: 'uuid-driver', automobileId: 'uuid-automobile', description: 'Entrega zona norte' } } },
						},
					},
				},
				responses: {
					'201': { description: 'Criado', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Allocation' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'404': { description: 'Não encontrado (driver/automóvel)', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
			get: {
				summary: 'Lista alocações',
				parameters: [
					{ in: 'query', name: 'page', schema: { type: 'integer' } },
					{ in: 'query', name: 'limit', schema: { type: 'integer' } },
					{ in: 'query', name: 'driverName', schema: { type: 'string' } },
					{ in: 'query', name: 'automobilePlate', schema: { type: 'string', pattern: '^[A-Za-z0-9]{7}$' } },
					{ in: 'query', name: 'status', schema: { $ref: '#/components/schemas/AllocationStatus' } },
				],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/PaginationOfAllocation' } } } ] } } } },
					'400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
		'/allocations/{id}': {
			put: {
				summary: 'Finaliza alocação',
				parameters: [ { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } } ],
				responses: {
					'200': { description: 'OK', content: { 'application/json': { schema: { allOf: [ { $ref: '#/components/schemas/ApiResponse' }, { properties: { data: { $ref: '#/components/schemas/Allocation' } } } ] } } } },
					'404': { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } } },
					'500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } } },
				},
			},
		},
	},
};


