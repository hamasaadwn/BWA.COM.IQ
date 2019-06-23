const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const passport = require("passport");
var crypto = require("crypto");
const nodemailer = require("nodemailer");
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

//change password page
router.get("/changepassword", ensureAuthenticated, (req, res, next) => {
  res.render("form-change-password", {
    title: "Change password"
  });
});

// change password Process
router.post("/changepassword", ensureAuthenticated, (req, res, next) => {
  var hash = req.user.password;
  var old_pass = req.body.old_password;
  var pass1 = req.body.new_password;
  var pass2 = req.body.confirm_password;

  req
    .checkBody("new_password", "Password shoud be between 8 to 40 characters")
    .isLength({ min: 8, max: 40 });

  let errors = req.validationErrors();

  bcrypt.compare(old_pass, hash, function(err, r) {
    if (r) {
      if (pass1 == pass2) {
        if (errors) {
          req.flash("danger", errors[0].msg);
          res.redirect("/auth/changepassword");
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(pass1, salt, function(err, pass1hash) {
              User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: { password: pass1hash } },
                (error, doc) => {
                  req.flash("success", "password have been updated");
                  res.redirect("/auth/changepassword");
                }
              );
            });
          });
        }
      } else if (pass1 != pass2) {
        req.flash("danger", "Passwords do not match");
        res.redirect("/auth/changepassword");
      }
    } else if (!r) {
      req.flash("danger", "incorrect password");
      res.redirect("/auth/changepassword");
    }
  });
});

// Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",

    failureFlash: true
  })(req, res, next);
});

//reset password
router.get("/forgot", function(req, res) {
  res.render("form-reset-password", {
    title: "reset password"
  });
});

// reset password process
router.post("/forgot", (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      req.flash("danger", "No user found with that email address.");
      res.redirect("/auth/forgot");
    }

    let resetPasswordToken = crypto.randomBytes(32).toString("hex");
    let resetPasswordExpires = Date.now() + 3600000;

    User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpires: resetPasswordExpires
        }
      }
    ).then(u => {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hamasaadwn@gmail.com",
          pass: ""
        }
      });
      let info = transporter.sendMail({
        to: u.email,
        from: " 'password reset' <passwordreset@bwa.com.iq>",
        subject: "Bwa.com.iq Password Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          req.headers.host +
          "/auth/" +
          resetPasswordToken +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      });

      req.flash(
        "info",
        "An e-mail has been sent to " + u.email + " with further instructions."
      );
      res.redirect("/auth/forgot");
    });
  });
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

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/");
  }
}

module.exports = router;
