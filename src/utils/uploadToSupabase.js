import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";
import { generateImageSizes } from "./generateImageSizes.js";
import { validateImage } from "./validateImage.js";

export async function uploadMultipleImages(files) {
  const uploads = files.map(async (file) => {

    // valida e processa imagem
    const processedBuffer = await validateImage(file.buffer);

    const { thumb, medium, full } = await generateImageSizes(processedBuffer);

    const id = uuidv4();

    const thumbPath = `thumb/thumb-${id}.webp`;
    const mediumPath = `medium/medium-${id}.webp`;
    const fullPath = `full/full-${id}.webp`;

    console.log('📦 Salvando imagens:', { thumbPath, mediumPath, fullPath });

    // função segura de upload
    const upload = async (path, fileBuffer) => {
      const { error } = await supabase.storage
        .from("products")
        .upload(path, fileBuffer, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });

      if (error) {
        console.log("❌ ERRO SUPABASE:", error);
        throw new Error(error.message);
      }
    };

    // faz upload das 3 versões
    await Promise.all([
      upload(thumbPath, thumb),
      upload(mediumPath, medium),
      upload(fullPath, full),
    ]);

    // retorna URLs públicas
    return {
      thumb: supabase.storage.from("products").getPublicUrl(thumbPath).data.publicUrl,
      medium: supabase.storage.from("products").getPublicUrl(mediumPath).data.publicUrl,
      full: supabase.storage.from("products").getPublicUrl(fullPath).data.publicUrl,
    };
  });

  return Promise.all(uploads);
}