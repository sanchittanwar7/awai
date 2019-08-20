const express = require("express");
const path = require("path");
// const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Models/User");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/public", express.static(__dirname + "/public"));

//DB Config
const db = "mongodb://127.0.0.1:27017/user";

//Connect DB
mongoose
  .connect(db)
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.log("error", err));

app.post("/upload", (req, res, next) => {
  // console.log(req);
  let imageFile = req.files.file;
  let email = req.body.email;
  let username = req.body.username;
  let filePath = `${__dirname}/public/${req.body.filename}.pdf`;
  const newUser = new User({
    username: username,
    email: email,
    filePath: filePath
  });

  console.log(newUser);

  newUser.save();

  imageFile.mv(`${__dirname}/public/${req.body.filename}.pdf`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ file: `public/${req.body.filename}.pdf` });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(8000, () => {
  console.log("8000");
});

module.exports = app;
