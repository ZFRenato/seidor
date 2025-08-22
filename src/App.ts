import dotenv from 'dotenv';
import express from 'express';
import { App } from './interfaces/http/App';
import router from './interfaces/http/routes';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = new App(express(), router, PORT);

app.start();