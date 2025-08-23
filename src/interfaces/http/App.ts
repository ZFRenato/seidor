import express, { Express, Router } from 'express';
import cors from 'cors';
import { errorJson } from './middlewares/errorJson';
import { errorHttp } from './middlewares/errorHttp';

export class App {
  constructor(
    private readonly express: Express,
    private readonly router: Router,
    private readonly port: number,
  ) {}
  
  public start(): void {
    this.middlewares();
    this.listen();
  }
  
  private routes(): void {
    this.express.use('/api/v1', this.router);
  }
  
  private middlewares(): void {
    this.express.use(express.json(), errorJson);
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
    this.routes();
    this.express.use(errorHttp);
  }

  private listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
};
