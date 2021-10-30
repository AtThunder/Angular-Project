const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const { env } = require("process");

const app = express();

mongoose
  .connect(
    "mongodb+srv://NEWUSER:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.qkaoi.mongodb.net/postApp?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to database.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join("backend/images")));

app.use("/api/posts", postsRouter);
app.use("/api/user", userRouter);

module.exports = app;
