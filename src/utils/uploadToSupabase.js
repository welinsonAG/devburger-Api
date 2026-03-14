import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";
import { generateImageSizes } from "./generateImageSizes.js";
import { validateImage } from "./validateImage.js";

export async function uploadMultipleImages(files) {

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  if (files.length > 5) {
    throw new Error("Maximum 5 images allowed");
  }

  const uploads = files.map(async (file) => {

    await validateImage(file.buffer);

    const { thumb, medium, full } = await generateImageSizes(file.buffer);

    const id = uuidv4();

    const thumbName = `${id}-thumb.webp`;
    const mediumName = `${id}-medium.webp`;
    const fullName = `${id}-full.webp`;

    const results = await Promise.all([
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

    results.forEach(r => {
      if (r.error) throw r.error;
    });

    return {
      thumb: supabase.storage.from("products").getPublicUrl(thumbName).data.publicUrl,
      medium: supabase.storage.from("products").getPublicUrl(mediumName).data.publicUrl,
      full: supabase.storage.from("products").getPublicUrl(fullName).data.publicUrl
    };
  });

  return Promise.all(uploads);
}