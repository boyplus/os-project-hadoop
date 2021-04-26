const util = require("util");
const multer = require("multer");
const maxSize = 1024 * 1024 * 1024;

const __basedir = "/home/hadoop/os-project-hadoop/server";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/input/");
  },
  filename: (req, file, cb) => {
    console.log('inside multer', file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
