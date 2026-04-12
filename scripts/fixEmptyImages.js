import 'dotenv/config';
import database from '../src/database/index.js';
import Product from '../src/app/models/Product.js';

async function run() {
  try {
    await database.init(); // 🔥 ESSENCIAL

    console.log('✅ Banco inicializado');

    const products = await Product.findAll();

    let count = 0;

    for (const product of products) {
      let images = product.images;

      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch {
          images = [];
        }
      }

      if (!Array.isArray(images) || images.length === 0) {
        await product.update({
          images: [
            {
              full: 'https://picsum.photos/300',
              medium: 'https://picsum.photos/300',
              thumb: 'https://picsum.photos/300',
            },
          ],
        });

        console.log(`🛠️ Produto ${product.id} corrigido`);
        count++;
      }
    }

    console.log(`\n🚀 FINALIZADO: ${count} produtos corrigidos`);
    process.exit();
  } catch (err) {
    console.error('❌ Erro:', err);
    process.exit(1);
  }
}

run();