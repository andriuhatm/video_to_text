const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// Load config
dotenv.config({
  path: "./config/config.env",
});

const app = express();

app.set("view engine", "pug");

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // this will show more info in the console
}

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Route / not implemented");
});

app.use("/transcribe", require("./routes/transcribe"));

const PORT = process.env.PORT || 4040;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
server.setTimeout(500000);
