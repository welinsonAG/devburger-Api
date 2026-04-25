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

  // 🔥 FORÇA CORS ANTES DE QUALQUER COISA
  this.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://devburger-interface-bgoa5g1bl-welinsonags-projects.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // 🔥 CORS OFICIAL (backup)
  this.app.use(cors({
    origin: [
      'https://devburger-interface-bgoa5g1bl-welinsonags-projects.vercel.app',
      'http://localhost:5173',
    ],
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
