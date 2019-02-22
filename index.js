const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database");
const i18n = require("i18n-express");

mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
let db = mongoose.connection;

// Check connection
db.once("open", function() {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", function(err) {
  console.log(err);
});

// Init App
const app = express();

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//cookie parser
app.use(cookieParser());

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//i18n
app.use(
  i18n({
    translationsPath: path.join(__dirname, "languages"), // <--- use here. Specify translations files path.
    siteLangs: ["ku", "ar", "en"],
    textsVarName: "translation",
    defaultLang: "ku"
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// route files
let index = require("./routes/index");
let auth = require("./routes/auth");
let profile = require("./routes/profile");
let admin = require("./routes/admin");
let car = require("./routes/car");
let dealers = require("./routes/dealers");
let parts = require("./routes/parts");
app.use("/", index);
app.use("/auth", auth);
app.use("/profile", profile);
app.use("/admin", admin);
app.use("/car", car);
app.use("/dealers", dealers);
app.use("/parts", parts);

// 404 page
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.redirect("/error");
    return;
  }
});

// Start Server
app.listen(3000, function() {
  console.log("Server started on port 3000...");
});
