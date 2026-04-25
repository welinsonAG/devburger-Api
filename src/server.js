import 'dotenv/config';
import app from './app.js';
import Database from './database/index.js';
import cors from 'cors';

app.use(cors({
  origin: 'https://devburger-interface-chi.vercel.app',
 methods: ['GET', 'POST', 'PUT', 'DELETE'],
 allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await Database.init(); // 👈 ESSENCIAL

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running at port ${PORT}...`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
  }
}

startServer();