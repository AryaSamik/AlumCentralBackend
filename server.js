const cors = require("cors");
const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};
require("dotenv").config();
const DB = require('./src/config/db.js')
const express = require("express");
const bodyParser = require('body-parser');
const loginRouter = require('./src/routes/login.js');
const registerRouter = require('./src/routes/register.js');

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/user', registerRouter);
app.use('/auth', loginRouter);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Server is up and running at port " + port);
});