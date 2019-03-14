const express = require("express");
const router = express.Router();
const multer = require("multer");

// Bring in profile Model
let profile = require("../models/Profile");

let User = require("../models/User");
let Make = require("../models/CarMake");
let CarModel = require("../models/CarModel");
let Car = require("../models/Car");

// users
router.get("/users", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    User.find({}, (err, user) => {
      res.render("admin-users", {
        title: "users",
        users: user
      });
    });
  } else {
    req.flash("danger", "you are not admin");
    res.redirect("/");
  }
});

// dealers
router.get("/dealers", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    profile.find({}, (err, profile) => {
      res.render("admin-profiles", {
        title: "dealers",
        profiles: profile
      });
    });
  } else {
    req.flash("danger", "you are not admin");
    res.redirect("/");
  }
});

// add make page
router.get("/addmake", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    res.render("admin-addmake", {
      title: "Add New Car Make"
    });
  } else {
    res.redirect("/error");
  }
});

// getMakes Json
router.get("/getMakes", (req, res) => {
  Make.find({})
    .sort({ count: -1 })
    .then(makes => {
      res.json(makes);
    });
});

// add make post
router.post("/addmake", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    let make = new Make();
    make.makeName = req.body.makeName;
    make.save().then(m => {
      res.json(m);
    });
  } else {
    res.json({ error: "makes error" });
  }
});

// add model page
router.get("/addmodel", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    res.render("admin-addmodel", {
      title: "Add New Car Model"
    });
  } else {
    res.redirect("/error");
  }
});

// getModels Json
router.post("/getModels", (req, res) => {
  Make.findById(req.body.modId).then(makes => {
    makes.count++;
    makes.save();
  });
  CarModel.find({ make: req.body.modId })
    .sort({ modName: "asc" })
    .then(mo => {
      res.json(mo);
    });
});

// add model post
router.post("/addmodel", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    let model = new CarModel();
    model.make = req.body.modId;
    model.modName = req.body.modName;
    model.save().then(mod => {
      res.json(mod);
    });
  } else {
    res.json({ error: "makes error" });
  }
});

// Get Single profile
router.get("/request/dealer/:id", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    profile.findById(req.params.id, (err, profile) => {
      res.render("admin-req-profile", {
        title: profile.name,
        profile
      });
    });
  }
});

// change state
router.get(
  "/profile/changestate/:state/:id",
  ensureAuthenticated,
  (req, res) => {
    if (req.user.role === "admin") {
      Profile.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { state: req.params.state } },
        { new: true }
      ).exec((err, profile) => {
        req.flash("success", "successful");
        res.redirect("/");
      });
    }
  }
);

// change state
router.post("/changestate/:state/:id", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { state: req.params.state } },
      { new: true }
    ).exec((err, profile) => {
      if (err) console.log(err);
      res.send("Success");
    });
  }
});

// change state
router.post("/car/:state/:id", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    Car.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { state: req.params.state } },
      { new: true }
    ).exec((err, car) => {
      if (err) console.log(err);
      res.send("Success");
    });
  }
});
// change user role
router.post("/changerole/:role/:id", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { role: req.params.role } },
      { new: true }
    ).exec((err, user) => {
      res.send("success");
    });
  }
});

// dealers
router.get("/requests", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    profile
      .find({ state: "req" })
      .populate("user")
      .exec((err, profile) => {
        res.render("admin-req", {
          title: "requests",
          profiles: profile
        });
      });
  } else {
    req.flash("danger", "you are not admin");
    res.redirect("/");
  }
});

//delete a car make
router.delete("/deletemake/:id", function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };
  let query2 = { make: req.params.id };
  CarModel.deleteMany(query2).exec();
  Make.deleteOne(query, function(err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//delete a car model
router.delete("/deletemodel/:id", function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };
  CarModel.deleteOne(query, function(err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
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
