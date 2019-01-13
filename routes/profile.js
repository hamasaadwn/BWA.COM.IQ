const express = require("express");
const router = express.Router();
const multer = require("multer");

// Bring in profile Model
let profile = require("../models/Profile");
const Car = require("../models/Car");

// multer config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads/avatars/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  // checking file type
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb("please upload only image");
  }
};
const upload = multer({
  storage: storage,
  limits: 1024 * 1024 * 20,
  fileFilter: fileFilter
}).single("avatar");

//my profile route
router.get("/myprofile", ensureAuthenticated, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .populate("user", ["name"])
    .then(profile => {
      res.render("profile", {
        title: "My profile",
        profile
      });
    });
});

//my vehicles route
router.get("/myvehicles", ensureAuthenticated, (req, res) => {
  Car.find({ user: req.user._id })
    .populate("make")
    .sort({ date: "desc" })
    .then(result => {
      res.render("list-myvehicles", {
        title: "My vehicles",
        result
      });
    });
});

// change state
router.post("/changestate/:state/:id", ensureAuthenticated, (req, res) => {
  Car.findById(req.params.id).then(c => {
    if (req.user.id == c.user) {
      Car.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { state: req.params.state } },
        { new: true }
      ).exec((err, profile) => {
        if (err) {
          return res.json({ status: "false" });
        } else {
          return res.json({ status: "true" });
        }
      });
    }
  });
});

//create profile route
router.get("/createprofile", ensureAuthenticated, (req, res) => {
  res.render("createProfile", {
    title: "create profile"
  });
});

//create or edit profile route
router.post("/createprofile", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    Profile.findOne({ user: req.user._id }).then(profile => {
      if (profile) {
        // Get fields
        var profileFields = {};
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.name) profileFields.name = req.body.name;
        if (req.body.phoneNumber)
          profileFields.phoneNumber = req.body.phoneNumber;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.info) profileFields.info = req.body.info;

        // Social
        profileFields.socialLinks = {};
        if (req.body.youtube)
          profileFields.socialLinks.youtube = req.body.youtube;
        if (req.body.twitter)
          profileFields.socialLinks.twitter = req.body.twitter;
        if (req.body.facebook)
          profileFields.socialLinks.facebook = req.body.facebook;
        if (req.body.instagram)
          profileFields.socialLinks.instagram = req.body.instagram;

        profileFields.address = {};
        if (req.body.city) profileFields.address.city = req.body.city;
        if (req.body.street) profileFields.address.street = req.body.street;
        if (err) {
          req.flash("danger", "error : " + err);
          res.redirect("/profile/createprofile");
        }
        Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true }
        ).then(profile => {
          req.flash("success", "your profile have been updated");
          res.redirect("/profile/myprofile");
        });
      } else {
        // Get fields
        var profileFields = new Profile();
        profileFields.user = req.user.id;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.name) profileFields.name = req.body.name;
        if (req.body.phoneNumber)
          profileFields.phoneNumber = req.body.phoneNumber;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.info) profileFields.info = req.body.info;

        // Social
        profileFields.socialLinks = {};
        if (req.body.youtube)
          profileFields.socialLinks.youtube = req.body.youtube;
        if (req.body.twitter)
          profileFields.socialLinks.twitter = req.body.twitter;
        if (req.body.facebook)
          profileFields.socialLinks.facebook = req.body.facebook;
        if (req.body.instagram)
          profileFields.socialLinks.instagram = req.body.instagram;
        if (req.file) profileFields.avatar = req.file.filename;

        profileFields.address = {};
        if (req.body.city) profileFields.address.city = req.body.city;
        if (req.body.street) profileFields.address.street = req.body.street;
        if (err) {
          req.flash("danger", "error : " + err);
          res.redirect("/profile/createprofile");
        }
        profileFields.save().then(profile => {
          req.flash(
            "success",
            "request have been send, your profile will be reviewed in 24 hours"
          );
          res.redirect("/profile/myprofile");
        });
      }
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/auth/login");
  }
}

module.exports = router;
