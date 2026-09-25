const multer = require('multer');

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
];

const fileFilter = (req, file, cb) => {
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isExtAllowed = /\.(jpe?g|png|heic|heif)$/i.test(file.originalname);

  if (isMimeAllowed || isExtAllowed) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPEG, PNG, and HEIC/HEIF images are allowed.');
    error.status = 400;
    cb(error, false);
  }
};

const multerInstance = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

const uploadOnboardingFiles = multerInstance.fields([
  { name: 'picture', maxCount: 1 },
  { name: 'nda', maxCount: 1 },
]);

module.exports = {
  uploadOnboardingFiles,
};
