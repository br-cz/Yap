const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//needed to setup cloudinary according to docs
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Yap',
      allowedFormats: ['jpeg', 'png', 'jpg']
      //format: async (req, file) => ['jpeg', 'png', 'jpg'], // supports promises as well
      //public_id: (req, file) => 'computed-filename-using-request',
    },
});

module.exports = {
    cloudinary,
    storage
}