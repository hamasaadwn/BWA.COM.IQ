const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const Car = require("../models/Car");
const Profile = require("../models/Profile");

// multer config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads/carpics/");
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
}).array("pics", 10);

router.get("/addnewcar", ensureAuthenticated, (req, res) => {
  res.render("addNewCar", {
    title: "Add New Car"
  });
});

router.post("/addnewcar", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if (err) console.log(err);
    let car = new Car();

    car.user = req.user.id;
    if (req.body.make) car.make = req.body.make;
    if (req.body.model) car.model = req.body.model;
    if (req.body.year) car.year = req.body.year;
    if (req.body.price) car.price = req.body.price;
    if (req.body.description) car.description = req.body.description;
    if (req.body.kmsd) car.kmsd = req.body.kmsd;
    if (req.body.roofType) car.roofType = req.body.roofType;
    if (req.body.fuelType) car.fuelType = req.body.fuelType;
    if (req.body.transmission) car.transmission = req.body.transmission;
    if (req.body.drivetrian) car.drivetrian = req.body.drivetrian;
    if (req.body.airbags) car.airbags = req.body.airbags;
    if (req.body.cylNo) car.cylNo = req.body.cylNo;
    if (req.body.seatCap) car.seatCap = req.body.seatCap;
    if (req.body.tankCap) car.tankCap = req.body.tankCap;
    if (req.body.vehicle_type) car.vehicle_type = req.body.vehicle_type;
    if (req.body.lseats) car.lseats = req.body.lseats;
    if (req.body.hseats) car.hseats = req.body.hseats;
    if (req.body.screen) car.screen = req.body.screen;
    if (req.body.camera) car.camera = req.body.camera;
    if (req.body.bluetooth) car.bluetooth = req.body.bluetooth;
    if (req.body.starter) car.starter = req.body.starter;
    if (req.body.cruise) car.cruise = req.body.cruise;
    if (req.body.ac) car.ac = req.body.ac;
    if (req.body.engine) car.engine = req.body.engine;

    if (req.body.location) car.location = req.body.location;
    if (req.files) {
      for (i = 0; i < req.files.length; i++) {
        car.pics.push(req.files[i].filename);
      }
    }

    car.save().then(c => {
      req.flash("success", "Car Added");
      res.redirect("/car/forsale/" + c._id);
    });
  });
});

//car profile
router.get("/forsale/:id", (req, res) => {
  Car.findById(req.params.id)
    .populate("user")
    .populate("make")
    .then(car => {
      Profile.findOne({ user: car.user._id }).then(pro => {
        Car.find({ state: "promoted" })
          .limit(8)
          .then(cars => {
            res.render("profile-car", {
              title: "car",
              car,
              cars,
              pro
            });
          });
      });
    });
});

//car edit
router.get("/edit/:id", (req, res) => {
  Car.findById(req.params.id)
    .populate("make")
    .then(car => {
      if (req.user.id == car.user) {
        res.render("form-edit-car", {
          title: "Edit Car",
          car
        });
      } else {
        res.redirect("/error");
      }
    });
});

//car edit submit
router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  let carFields = {};

  if (req.body.make) carFields.make = req.body.make;
  if (req.body.model) carFields.model = req.body.model;
  if (req.body.year) carFields.year = req.body.year;
  if (req.body.price) carFields.price = req.body.price;
  if (req.body.description) carFields.description = req.body.description;
  if (req.body.kmsd) carFields.kmsd = req.body.kmsd;
  if (req.body.roofType) carFields.roofType = req.body.roofType;
  if (req.body.fuelType) carFields.fuelType = req.body.fuelType;
  if (req.body.transmission) carFields.transmission = req.body.transmission;
  if (req.body.drivetrain) carFields.drivetrain = req.body.drivetrain;
  if (req.body.airbags) carFields.airbags = req.body.airbags;
  if (req.body.cylNo) carFields.cylNo = req.body.cylNo;
  if (req.body.seatCap) carFields.seatCap = req.body.seatCap;
  if (req.body.tankCap) carFields.tankCap = req.body.tankCap;
  if (req.body.vehicle_type) carFields.vehicle_type = req.body.vehicle_type;
  if (req.body.lseats) carFields.lseats = req.body.lseats;
  if (req.body.hseats) carFields.hseats = req.body.hseats;
  if (req.body.screen) carFields.screen = req.body.screen;
  if (req.body.camera) carFields.camera = req.body.camera;
  if (req.body.bluetooth) carFields.bluetooth = req.body.bluetooth;
  if (req.body.starter) carFields.starter = req.body.starter;
  if (req.body.cruise) carFields.cruise = req.body.cruise;
  if (req.body.ac) carFields.ac = req.body.ac;
  if (req.body.engine) carFields.engine = req.body.engine;

  Car.findOneAndUpdate(
    { _id: req.params.id },
    { $set: carFields },
    { new: true }
  ).then(car => {
    req.flash("success", "Car information have been upadated");
    res.redirect("/profile/myvehicles");
  });
});

//delete a car
router.delete("/delete/:id", function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = { _id: req.params.id };

  Car.findById(req.params.id, function(err, car) {
    if (car.user != req.user.id) {
      res.status(500).send();
    } else {
      car.pics.forEach(function(element) {
        fs.unlink("./public/uploads/carpics/" + element, err => {
          if (err) throw err;
        });
      });

      Car.deleteOne(query, function(err) {
        if (err) {
          console.log(err);
        }
        res.send("Success");
      });
    }
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/error");
  }
}

module.exports = router;
