import sharp from 'sharp';

export async function compressImage(buffer) {
  const compressedImage = await sharp(buffer)
    .rotate()
    .resize({
      resize: {
        width: 1200,
        withoutEnlargement: true,
      },
    })
    .webp({
      quality: 80,
    })

    .toBuffer();
  return compressedImage;
}
