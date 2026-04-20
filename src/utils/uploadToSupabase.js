import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";
import { generateImageSizes } from "./generateImageSizes.js";
import { validateImage } from "./validateImage.js";

export async function uploadMultipleImages(files) {
  const uploads = files.map(async (file) => {

    const processedBuffer = await validateImage(file.buffer);

    const { thumb, medium, full } = await generateImageSizes(processedBuffer);

    // 🔥 blindagem
    if (!thumb || !medium || !full) {
      throw new Error("Erro ao gerar imagens (thumb, medium ou full)");
    }

    const id = uuidv4();

    const thumbPath = `thumb/${id}.webp`;
    const mediumPath = `medium/${id}.webp`;
    const fullPath = `full/${id}.webp`;

    console.log("📦 Buffers:", {
      thumbSize: thumb?.length,
      mediumSize: medium?.length,
      fullSize: full?.length,
    });

    const upload = async (path, fileBuffer) => {
      if (!fileBuffer) {
        throw new Error(`Arquivo inválido: ${path}`);
      }

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

    await Promise.all([
      upload(thumbPath, thumb),
      upload(mediumPath, medium),
      upload(fullPath, full),
    ]);

    return {
      thumb: supabase.storage.from("products").getPublicUrl(thumbPath).data.publicUrl,
      medium: supabase.storage.from("products").getPublicUrl(mediumPath).data.publicUrl,
      full: supabase.storage.from("products").getPublicUrl(fullPath).data.publicUrl,
    };
  });

  return Promise.all(uploads);
}