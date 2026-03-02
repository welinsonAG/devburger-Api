// localmente
//import app from './app.js';

//const PORT =3001;

//app.listen(PORT, '0.0.0.0',() => console.log(`Server is running at port ${PORT}...` ));//


//vercel dev

import express from 'express';
import dotenv, { config } from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import routes from './routes.js';
app.use(routes);

export default app;