const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const passport = require("passport");
var passportGoogle = require("../auth/google");

// Bring in User Model
let User = require("../models/User");

// Register Proccess
router.post("/register", function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  const phoneNumber = req.body.phoneNumber;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("phoneNumber", "Phone number is required").notEmpty();
  /*req.checkBody("email", "Email already exists").custom(value => {
    User.findOne({ email: value }).then(user => {
      if (user) {
        return Promise.reject("Email already exists");
      }
    });
  });*/
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password", "Password shoud be between 8 to 40 characters")
    .isLength({ min: 8, max: 40 });
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("/", {
      title: "register errors",
      errors: errors
    });
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.login(newUser, function(err) {
              if (err) {
                console.log(err);
              }
              req.flash("success", "You have registered successfully");
              res.redirect("/");
            });
          }
        });
      });
    });
  }
});

/* GOOGLE ROUTER */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

/* facebook router */
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",

    failureFlash: true
  })(req, res, next);
});

// logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/");
});

//check email route
router.post("/register/checkemail", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.json({ status: "false" });
    } else {
      return res.json({ status: "true" });
    }
  });
});

module.exports = router;
