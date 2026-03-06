import supabase from '../config/supabase.js';

export async function deleteMultipleImages(imageUrls) {

  const fileNames = imageUrls.map((url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
    
  });
  const { error } = await supabase.storage
  .from('devburger')
  .remove(fileNames);

  if (error) {
    throw new Error(error.message);
  }
}
