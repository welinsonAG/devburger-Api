import database from "./src/database/index.js";
import Product from "./src/app/models/Product.js";

const BASE_URL =
"https://gishberyzmwbclyxgqrp.supabase.co/storage/v1/object/public/products/";

async function fixImages() {

  const products = await Product.findAll();

  for (const product of products) {

    if (!product.images || product.images[0] === "") {

      const fileName = `${product.id}.png`;

      const imageUrl = BASE_URL + fileName;

      await product.update({
        images: [imageUrl],
      });

      console.log(`✅ Produto ${product.id} atualizado`);
    }

  }

  console.log("🎉 Correção finalizada");
}

fixImages();