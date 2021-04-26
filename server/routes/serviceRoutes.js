const uploadFile = require("../middleware/upload");
const { exec, execSync } = require("child_process");

module.exports = (app) => {
  app.get("/api/test", async (req, res) => {
    res.send({ success: true, msg: "Hello World" });
  });

  app.get("/api/novels", async (req, res) => {
    try {
      console.log('novels');
      const cmd = `/home/hadoop/hadoop/hadoop-3.1.4/bin/hadoop fs -ls /output | grep /output`
      // const cmd = 'ls';
      exec(cmd, (error, stdout, stderr) => {
        console.log('inside');
        console.log(stdout);
        res.send({ msg: 'balo' });
      });
    } catch (err) {
      res.status(500).send({ message: "error", error: err });
    }
  });

  app.post("/api/upload", async (req, res) => {
    try {
      await uploadFile(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      const name = req.file.originalname;

      const str = `cp /home/hadoop/os-project-hadoop/server/resources/input/${name} ~/Desktop`;
      execSync(str, (error, stdout, stderr) => {
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
      const copy = `hadoop hdfs put ${name} /input`;
      execSync(copy, (error, stdout, stderr) => {
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
