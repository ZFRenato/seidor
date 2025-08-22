import express from 'express';
import { App } from './interfaces/http/App';

const app = new App(express(), new Router(), 3000);

app.start();