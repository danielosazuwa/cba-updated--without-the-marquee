// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');


// const uploadDir = 'courseAvatar/';

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir); 
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only .jpg, .png and .jpeg format allowed!'), false);
//   }
// };

// // Create the upload middleware
// const CourseUpload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = CourseUpload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'courseBanner/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const CourseUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpg, .png and .jpeg format allowed!'), false);
        }
    }
});

module.exports = CourseUpload;