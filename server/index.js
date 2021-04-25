const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

require("./routes/serviceRoutes")(app);

const PORT = process.env.PORT || 5000;
console.log("Start node server in PORT", PORT);
app.listen(PORT);
