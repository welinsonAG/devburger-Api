import { v4 as uuidv4 } from 'uuid';
import supabase from '../config/supabase.js';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function uploadMultipleImages(files) {

  const uploads = files.map(async (file) => {

    console.log('Uploading:', file.mimetype);

    // ✅ Validação segura de MIME
    const mime = (file.mimetype || '').toLowerCase().trim();

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(mime)) {
      throw new Error(`mime type ${file.mimetype} is not supported`);
    }

    // ✅ Tamanho
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large');
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file.buffer, {
        contentType: mime
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return data.publicUrl;
  });

  return Promise.all(uploads);
}