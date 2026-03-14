import sharp from 'sharp';

export async function validateImage(buffer) {
   
    const metadata = await sharp(buffer).metadata();
    const MAX_WIDTH = 5000;
    const MAX_HEIGHT = 5000;

    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image');
    }
    
  if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
    throw new Error('Image size is too large');
  }

  return true;
}