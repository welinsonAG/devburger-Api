import 'dotenv/config';
import app from './app.js';
import Database from './database/index.js';

const PORT = process.env.PORT || 3001;
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('🔥 TESTE DEPLOY NOVO');
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