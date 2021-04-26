const uploadFile = require("../middleware/upload");
const { exec, execSync } = require("child_process");
var fs = require('fs');

module.exports = (app) => {
  app.get("/api/test", async (req, res) => {
    res.send({ success: true, msg: "Hello World" });
  });
  const hadoop = '/home/hadoop/hadoop/hadoop-3.1.4/bin/hadoop';
  const modifyData = (text) => {
    let ans = text.split('\n');
    ans = ans.slice(0, ans.length - 1)
    ans = ans.map((el) => {
      return { word: el.split('\t')[0], count: el.split('\t')[1] }
    });
    function compare(a, b) {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    }
    ans.sort(compare);
    console.log(ans);
    return ans;
  }
  app.get('/api/novel', async (req, res) => {
    const { name } = req.query;
    console.log(name);
    const readOutput = `cd ~ && ${hadoop} fs -cat /output/${name}/part-r-00000 > tempFile`;
    execSync(readOutput, (error, stdout, stderr) => {
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

    fs.readFile('/home/hadoop/tempFile', 'utf8', function (err, data) {
      res.send({ success: true, wordcount: modifyData(data) });
    });

  });
  app.get("/api/novels", async (req, res) => {
    try {
      const cmd = `${hadoop} fs -ls /output | grep /output`
      exec(cmd, (error, stdout, stderr) => {
        let str = stdout.split('\n');
        str = str.map((el) => {
          return el.split('/output');
        })
        let answer = [];
        for (let i = 0; i < str.length - 1; i++) {
          const temp = str[i][0];
          answer.push({ date: temp.slice(temp.length - 17, temp.length - 1), name: str[i][1].slice(1) });
        }
        res.send({ novels: answer });
      });
    } catch (err) {
      res.status(500).send({ message: "error", error: err });
    }
  });

  app.post("/api/upload", async (req, res) => {
    try {
      try {
        const removeFileInServer = `rm /home/hadoop/os-project/server/resources/input/*`
        execSync(removeFileInServer, (error, stdout, stderr) => {
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
      } catch (error) {

      }


      console.log('Uploading file into the server');
      await uploadFile(req, res);
      console.log('Upload file into server successfully');

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      const name = req.file.originalname;

      try {
        const removeFile = `${hadoop} fs -rm -R /input/${name}`;
        execSync(removeFile, (error, stdout, stderr) => {
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
      } catch (err) {
        console.log(`File is not in the hdfs, it's fine`);
      }

      try {
        const copyFile = `cd ~ && ${hadoop} fs -put os-project-hadoop/server/resources/input/${name} /input/`;
        execSync(copyFile, (error, stdout, stderr) => {
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
      } catch (err) {
        console.log(`This file already in hdfs, it's fine`);
      }


      const di = name.split('.')[0];
      try {
        const removeOldOutput = `${hadoop} fs -rm -R /output/${di}`;
        execSync(removeOldOutput, (error, stdout, stderr) => {
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
      } catch (err) {
        console.log('This novel never run mapreduce before, it is fine');

      }


      const execute = `cd ~ && ${hadoop} jar WordCount.jar WordCount /input/${name} /output/${di}`;
      execSync(execute, (error, stdout, stderr) => {
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

      const readOutput = `cd ~ && ${hadoop} fs -cat /output/${di}/part-r-00000 > tempFile`;
      execSync(readOutput, (error, stdout, stderr) => {
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

      fs.readFile('/home/hadoop/tempFile', 'utf8', function (err, data) {
        res.send({ success: true, text: data });
      });

    } catch (err) {
      res.status(500).send({ message: "error", error: err });
    }
  });
};
