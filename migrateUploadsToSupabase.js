import fs from "fs";
import path from "path";

import Product from "./src/app/models/Product.js";
import database from "./src/database/index.js";
import "dotenv/config";
import { uploadMultipleImages } from "./src/utils/uploadToSupabase.js";

const uploadsFolder = path.resolve("./uploads");

async function migrateImages() {
  try {

    const files = fs.readdirSync(uploadsFolder);

    const products = await Product.findAll();

    for (let i = 0; i < products.length; i++) {

      const product = products[i];
      const file = files[i];

      if (!file) continue;

      const filePath = path.join(uploadsFolder, file);

      const fakeFile = {
        path: filePath,
        originalname: file,
        mimetype: "image/jpeg"
      };

      const uploaded = await uploadMultipleImages([fakeFile]);

      await product.update({
        images: uploaded
      });

      console.log(`✅ ${product.name} → enviado para Supabase`);

    }

    console.log("🎉 Migração finalizada!");

  } catch (err) {

    console.error("❌ Erro na migração:", err);

  }
}

setTimeout(() => {
  migrateImages();
}, 2000);