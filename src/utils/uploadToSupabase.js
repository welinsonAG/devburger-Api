import { v4 as uuidv4 } from 'uuid';
import supabase from '../config/supabase.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
export async function uploadMultipleImages(files) {
  const uploads = files.map(async (file) => {

    //validate tipo de arquivo
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG and WEBP are allowed.',
      );
    }

    //validate tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size is too large. Maximum size is 5MB.');
    }
  



  const fileName = `${uuidv4()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('products').getPublicUrl(fileName);

  return data.publicUrl;
});


return Promise.all(uploads);
}