import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';
import cors from 'cors';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
 
constructor() {
  this.app = express();


  // 🔥 CORS OFICIAL (backup)
  this.app.use(cors({
    origin: [
      'https://devburger-interface-chi.vercel.app',
       'https://devburger-interface-bgoa5g1bl-welinsonags-projects.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  this.app.use(express.json());

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
