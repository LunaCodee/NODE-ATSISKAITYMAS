const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const ticketsRouter = require("./routes/tickets");
const userRouter = require("./routes/user");
require("dotenv").config();
const mongoose = require("mongoose");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(ticketsRouter);
app.use(userRouter);

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => {
    console.log("CONNECTED");
  })
  .catch((err) => {
    console.log("err", err);
  });

app.listen(process.env.PORT, () => {
  console.log("Your app is alive!!!!!");
});
