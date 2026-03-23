import sharp from 'sharp';

export async function validateImage(buffer) {
  const image = sharp(buffer);

  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image');
  }

  // redimensiona automaticamente
  const resized = await image
    .resize(1000, 1000, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();

  return resized;
}