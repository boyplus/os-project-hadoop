const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

const __basedir = "/Users/boyplus/Desktop/MyGit/os-project-hadoop/server";
// const __basedir = "/home/hadoop/";
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/input/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
