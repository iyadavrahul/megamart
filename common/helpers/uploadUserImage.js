const multer = require("multer");
const fs = require("fs");

function createUserImagePath(req, res, next) {
  // console.log("req.body");
  // fs.exists("./public", function (exist) {
  //   if (exist) {
  //     console.log("File created");
  //     next();
  //   } else {
  //     fs.mkdir("./public", { recursive: true }, function (err) {
  //       if (err) {
  //         console.log("Error in file creation");
  //         next();
  //       }
  //       next();
  //     });
  //   }
  // });
  next();
}
module.exports.createUserImagePath = createUserImagePath;

const uploadUserImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public`);
    },
    filename: function (req, file, cb) {
      console.log(file);
      const name = file.originalname.split(" ").join("-").split(".")[0];
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      if (ext == "*") {
        extArray = file.originalname.split(".");
        ext = extArray[extArray.length - 1];
      }
      cb(null, name + Date.now().toString() + `.${ext}`);
    },
  }),
});

module.exports.uploadUserImage = uploadUserImage;
