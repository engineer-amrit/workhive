import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs/promises";
import { Request } from "express";
import blockHandler from "@/classes/controllers/blockHandler.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPL_DIR = path.join(__dirname, "../public/uploads");

// Ensure base directory exists asynchronously
const ensureDirectoryExists = async (dir: string) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// File filter for multer
const fileFilter = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/avif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file if it's an allowed type
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, HEIC images are allowed.'));
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    // get the destination directory
    await ensureDirectoryExists(UPL_DIR);
    cb(null, UPL_DIR);
  },
  // Filename function to customize the file name before saving
  filename: (_, file, cb) => {
    // Generate unique file name using the current timestamp and original file extension
    const uniqueSuffix = Date.now() + Math.floor(Math.random() * 1000);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + fileExtension); // Use original file extension
  }
});

// Multer upload configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20 // 20MB file size limit
  },
  fileFilter
});


export const pathExtractor = blockHandler.createMiddleware(async (req) => {
  const file = req.file as Express.Multer.File | undefined;
  const files = req.files as {
    [key: string]: Express.Multer.File[]
  };

  // If a single file is uploaded
  if (file) {
    req.body[file.fieldname] = file.path;
  }
  // If multiple files are uploaded
  else if (files) {
    for (const key in files) {
      const fileArray = files[key];

      // Ensure we process files correctly based on how many files are associated with the field
      req.body[key] = fileArray.length > 1
        ? fileArray.map(file => file.path) // Multiple files: map to paths
        : fileArray[0].path;               // Single file: use first file's path
    }
  }
})


export default upload;
