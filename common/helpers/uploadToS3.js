const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
let s3 = new S3Client({
  // eslint-disable-next-line no-undef
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    // eslint-disable-next-line no-undef
    accessKeyId: process.env.S3_ACCESS_KEY,
    // eslint-disable-next-line no-undef
    secretAccessKey: process.env.S3_ACCESS_SECRET,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

function createImagePath(req, res, next) {
  next();
}
module.exports.createImagePath = createImagePath;

const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    // eslint-disable-next-line no-undef
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      console.log(`ext ->> `, ext, ` file.fieldname ->> `, file.fieldname);
      cb(null, `Manager/` + Date.now().toString() + "." + ext);
    },
  }),
});

module.exports.uploadImage = uploadImage;
