const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
// Passport Config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys");
mongoose
  .connect(db.MongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected ...");
  })
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }));
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(8080, () => {
  console.log("Running...");
});
