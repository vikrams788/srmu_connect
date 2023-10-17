const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images'); // Set the destination folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Add a unique suffix to prevent overwriting files
      cb(null, file.originalname + '-' + uniqueSuffix); // Use the original file name with a unique suffix
    }
});
  
const upload = multer({ storage: storage });
  
module.exports = { upload };