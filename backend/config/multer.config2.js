// config/multer.config2.js
const multer = require("multer");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
});

module.exports = { uploadMemory };

