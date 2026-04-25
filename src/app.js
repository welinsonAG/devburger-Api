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

  // 🔥 1. CORS PRIMEIRO
  this.app.use(cors({
    origin: [
      'https://devburger-interface-chi.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // 🔥 2. FORÇA PRE-FLIGHT (ISSSO É O QUE ESTÁ FALTANDO)
  this.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://devburger-interface-chi.vercel.app");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

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
