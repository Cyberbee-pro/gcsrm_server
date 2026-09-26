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

/**
 * Middleware to parse stringified JSON array fields from multipart/form-data
 * (socials and faDetails) into JavaScript arrays before express-validator runs.
 */
const parseOnboardingJsonFields = (req, res, next) => {
  if (req.body) {
    if (typeof req.body.socials === 'string') {
      try {
        req.body.socials = JSON.parse(req.body.socials);
      } catch (err) {
        // Leave as string so express-validator captures invalid format
      }
    }

    if (typeof req.body.faDetails === 'string') {
      try {
        req.body.faDetails = JSON.parse(req.body.faDetails);
      } catch (err) {
        // Leave as string so express-validator captures invalid format
      }
    }
  }
  next();
};

module.exports = {
  uploadOnboardingFiles,
  parseOnboardingJsonFields,
};
