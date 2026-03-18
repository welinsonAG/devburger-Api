import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";
import { generateImageSizes } from "./generateImageSizes.js";
import { validateImage } from "./validateImage.js";

export async function uploadMultipleImages(files) {

  const uploads = files.map(async (file) => {

    await validateImage(file.buffer);

    const { thumb, medium, full } = await generateImageSizes(file.buffer);

    const id = uuidv4();

    const thumbName = `${id}-thumb.webp`;
    const mediumName = `${id}-medium.webp`;
    const fullName = `${id}-full.webp`;

    await Promise.all([
      supabase.storage.from("products").upload(thumbName, thumb, {
        contentType: "image/webp",
        cacheControl: "31536000"
      }),

      supabase.storage.from("products").upload(mediumName, medium, {
        contentType: "image/webp",
        cacheControl: "31536000"
      }),

      supabase.storage.from("products").upload(fullName, full, {
        contentType: "image/webp",
        cacheControl: "31536000"
      })
    ]);

    return {
      thumb: supabase.storage.from("products").getPublicUrl(thumbName).data.publicUrl,
      medium: supabase.storage.from("products").getPublicUrl(mediumName).data.publicUrl,
      full: supabase.storage.from("products").getPublicUrl(fullName).data.publicUrl
    };
  });

  return Promise.all(uploads);
}