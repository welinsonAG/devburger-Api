/*import { fileURLToPath } from 'url';
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

export default upload;*/

import multer from "multer";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, JPEG, PNG and WEBP images are allowed")
      );
    }

    cb(null, true);
  },
});

export default upload;