const { Readable } = require('stream');
const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');

const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};
exports.imageToCloudinary = catchAsync(async (req, res, next) => {
  const data = await sharp(req.file.buffer).webp({ quality: 20 }).toBuffer();
  const uploadRes = await cloudinary.uploader.upload_stream(
    {
      folder: 'event',
    },
    (error, result) => {
      if (error) return next(error);
      req.body.image = result.secure_url;
      next();
    }
  );
  bufferToStream(data).pipe(uploadRes);
});
