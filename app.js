const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");

require("dotenv").config();
require("./src/config/db")();

const app = express();

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

// API Routes
app.use("/auth", require("./src/routes/api/apiAuthRouter"));
app.use("/rest/brands", require("./src/routes/api/apiBrandRouter"));

// UI Routes
app.use("/auth", require("./src/routes/ui/uiAuthRouter"));
app.use("/admin/pens", require("./src/routes/ui/uiPenRouter"));

app.use((req, res, next) => {
  res.status(404).send("Page / Endpoint Not Found");
});

module.exports = app;
