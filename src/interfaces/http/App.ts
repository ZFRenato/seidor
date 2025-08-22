import express, { Express, Router } from 'express';

export class App {
  constructor(
    private readonly express: Express,
    private readonly router: Router,
    private readonly port: number,
  ) {}
  
  public start(): void {
    this.routes();
    this.listen();
  }

  private routes(): void {
    this.express.use('/api/v1', this.router);
  }

  private listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
};
