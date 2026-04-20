import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';
import cors from 'cors';


import './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
 
constructor() {
  this.app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    process.env.APP_URL
  ].filter(Boolean);

  this.app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));

  this.middlewares();
  this.routes();
}
   
   

  middlewares() {
    
    this.app.use(express.json());
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );

     this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );

  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
