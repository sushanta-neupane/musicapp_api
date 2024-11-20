import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Set up storage for uploaded files
const storageConf = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Set the destination to the uploads directory
  },
  filename: (req, file, cb) => {
    // Use a unique filename for each upload
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Middleware setup for multer
export const upload = multer({ storage: storageConf });

export const uploadImg = multer({ storage: multer.memoryStorage() });
