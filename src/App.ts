import dotenv from 'dotenv';
import express from 'express';
import { App } from './interfaces/http/App';
import router from './interfaces/http/routes';
import { runSeed } from './seed';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap(): Promise<void> {
	if (process.env.NODE_ENV !== 'production') {
		await runSeed().catch((err) => console.error('Falha ao rodar seed no boot:', err));
	}
	const app = new App(express(), router, PORT);
	app.start();
}

bootstrap();