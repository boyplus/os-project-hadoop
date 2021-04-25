const uploadFile = require("../middleware/upload");
const { exec } = require("child_process");

module.exports = (app) => {
  app.get("/api/test", async (req, res) => {
    console.log("hello");
    res.send({ success: true, msg: "Hello World" });
  });

  app.post("/api/upload", async (req, res) => {
    try {
      await uploadFile(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      exec("ls -la", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });

      res.status(200).send({
        message: "Uploaded the file successfully: ",
      });
    } catch (err) {
      res.status(500).send({ message: "error", error: err });
    }
  });
};
