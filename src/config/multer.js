import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import multer from 'multer';



// Cria o equivalente de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Agora você pode usar normalmente
const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

export default upload;
