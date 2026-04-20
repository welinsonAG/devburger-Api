import sharp from "sharp";

export async function generateImageSizes(buffer) {
    
    const thumb = await sharp(buffer)
    .rotate()
    .resize({
       width: 300, withoutEnlargement: true 
    })
    .webp({quality: 80})
    .toBuffer()
       
   const medium = await sharp(buffer)
    .rotate()
    .resize({
       width: 600, withoutEnlargement: true 
    })
    .webp({quality: 80})
    .toBuffer()
    
   const full = await sharp(buffer)
    .rotate()
    .resize({
       width: 1200, withoutEnlargement: true 
    })
    .webp({quality: 85})
    .toBuffer()
    
    return {thumb, medium, full};
  
}