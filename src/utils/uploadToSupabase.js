import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";
import { generateImageSizes } from "./generateImageSizes.js";
import { validateImage } from "./validateImage.js";


export async function uploadMultipleImages(files) {

  const uploads = files.map(async (file) => {

   const processedBuffer = await validateImage(file.buffer);

    const { thumb, medium, full } = await generateImageSizes(processedBuffer);

    const id = uuidv4();

    const thumbName = `thumb-${id}.webp`;
    const mediumName = `medium-${id}.webp`;
    const fullName = `full-${id}.webp`;

   const thumbPath = `thumb/${thumbName}`;
const mediumPath = `medium/${mediumName}`;
const fullPath = `full/${fullName}`;

    await Promise.all([
      supabase.storage.from("products").upload(thumbPath, thumb, {
        contentType: "image/webp",
        cacheControl: "31536000"
      }),

      supabase.storage.from("products").upload(mediumPath, medium, {
        contentType: "image/webp",
        cacheControl: "31536000"
      }),

      supabase.storage.from("products").upload(fullPath, full, {
        contentType: "image/webp",
        cacheControl: "31536000"
      })
    ]);

    return {
      thumb: supabase.storage.from("products").getPublicUrl(thumbPath).data.publicUrl,
      medium: supabase.storage.from("products").getPublicUrl(mediumPath).data.publicUrl,
      full: supabase.storage.from("products").getPublicUrl(fullPath).data.publicUrl
    };
  });

  return Promise.all(uploads);
}