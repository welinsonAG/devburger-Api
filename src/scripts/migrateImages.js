import Database from './database/index.js';
import Product from '../app/models/Product.js';

async function migrateImages() {
  // 👇 ESPERA CONEXÃO
  await Database.init();

  app.listen(3001, '0.0.0.0', () => {
    console.log('🚀 Server started on port 3001...');
  });

  startServer();
  
  const products = await Product.findAll();

  for (const product of products) {
    const images = product.images;

    if (!images || images.length === 0) continue;

    const first = images[0];

    if (typeof first === 'string') {
      const newImages = images.map((url) => ({
        thumb: url,
        medium: url,
        full: url,
      }));

      await product.update({
        images: newImages,
      });

      console.log(`✅ Produto atualizado: ${product.name}`);
    }
  }

  console.log('🚀 Migração finalizada');
}

migrateImages();