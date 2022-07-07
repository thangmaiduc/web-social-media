const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const express = require("express");
const app = express();

dotenv.config();
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);

app.use(function (req, res, next) {
  try {
    let err = new Error("Không tìm thấy trang");
    err.statusCode = 404;
    throw err;
  } catch (error) {
    next(error);
  }
});

// error handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;

  if (status === 422) {
    let errors = {};
    error.data.forEach((err) => {
      let key = err.param;
      let value = err.msg;

      errors[key] = value;
    });
    res.status(status).json({ message: message, errors });
    return;
  }
  res.status(status).json({ message: message });
});

const db = require("./models").sequelize;

db.sync({ force: false, alter: false })
  .then()
  .catch((err) => {
    console.log(err);
    console.log("Syncing database was fail");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
