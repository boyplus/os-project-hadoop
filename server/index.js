const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const http = require("http");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
require("./routes/serviceRoutes")(app);

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Listen on port ", PORT);
});
