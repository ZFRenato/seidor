import express, { Express, Router } from 'express';
import cors from 'cors';
import { errorJson } from './middlewares/errorJson';
import { errorHttp } from './middlewares/errorHttp';
import swaggerUi from 'swagger-ui-express';
import { openapiDoc } from './docs/openapi';

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
    this.express.get('/openapi.json', (_req, res) => res.json(openapiDoc));
    this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
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
