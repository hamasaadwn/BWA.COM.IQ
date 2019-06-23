const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const CarParts = require("../models/CarParts");
const Car = require("../models/Car");

// multer config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads/partpics/");
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

router.get("/addCarPart", ensureAuthenticated, (req, res) => {
  res.render("form-carpart", {
    title: "Add New Car Part"
  });
});

router.post("/addCarPart", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if (err) console.log(err);
    let part = new CarParts();

    part.user = req.user.id;
    if (req.body.name) part.name = req.body.name;
    if (req.body.make) part.make = req.body.make;
    if (req.body.model) part.model = req.body.model;
    if (req.body.year) part.year = req.body.year;
    if (req.body.price) part.price = req.body.price;
    if (req.body.description) part.description = req.body.description;
    if (req.body.location) part.location = req.body.location;
    if (req.files) {
      for (i = 0; i < req.files.length; i++) {
        part.pics.push(req.files[i].filename);
      }
    }

    part.save().then(c => {
      req.flash("success", "Car Part Added");
      res.redirect("/parts/forsale/" + c._id);
    });
  });
});

//my vehicle parts route
router.get("/myvehicleparts", ensureAuthenticated, (req, res) => {
  CarParts.find({ user: req.user._id })
    .populate("make")
    .sort({ date: "desc" })
    .then(result => {
      res.render("list-myvehicle-parts", {
        title: "My vehicle parts",
        result
      });
    });
});

//car profile
router.get("/forsale/:id", (req, res) => {
  CarParts.findById(req.params.id)
    .populate("user")
    .populate("make")
    .then(part => {
      Profile.findOne({ user: part.user._id }).then(pro => {
        res.render("profile-part", {
          title: "car part",
          part,
          pro
        });
      });
    });
});

router.get("/list", (req, res) => {
  let page = 1;
  if (req.query.page != undefined || req.query.page != null) {
    page = parseInt(req.query.page);
  }
  CarParts.paginate({ state: "active" }, { page: page, limit: 15 }).then(
    result => {
      Car.find({ state: "promoted" })
        .limit(8)
        .sort({ date: -1 })
        .then(promotedCars => {
          res.render("list-parts", {
            title: "parts",
            result,
            page,
            promotedCars
          });
        });
    }
  );
});

//filter search
router.get("/search", (req, res) => {
  let minPrice = parseInt(req.query.minPrice);
  let maxPrice = parseInt(req.query.maxPrice);
  let make = req.query.make;
  let model = req.query.model;
  let year = req.query.year;
  let location = req.query.location;
  let page = parseInt(req.query.page);

  if (make == "") {
    CarParts.paginate(
      {
        $and: [
          { model: { $regex: model, $options: "i" } },
          { year: new RegExp(year, "i") },
          { location: new RegExp(location, "i") },
          { price: { $lte: maxPrice, $gte: minPrice } },
          { $or: [{ state: "active" }, { state: "promoted" }] }
        ]
      },
      { page: page, limit: 15, sort: { date: -1 } }
    ).then(result => {
      Car.find({ state: "promoted" })
        .limit(8)
        .sort({ date: -1 })
        .then(promotedCars => {
          res.render("list-search-parts", {
            title: "search",
            result,
            maxPrice,
            minPrice,
            make,
            model,
            year,
            location,
            page,
            promotedCars
          });
        });
    });
  } else {
    CarParts.paginate(
      {
        $and: [
          { make: make },
          { model: { $regex: model, $options: "i" } },
          { year: new RegExp(year, "i") },
          { location: new RegExp(location, "i") },
          { price: { $lte: maxPrice, $gte: minPrice } },
          { $or: [{ state: "active" }, { state: "promoted" }] }
        ]
      },
      { page: page, limit: 15, sort: { date: -1 } }
    ).then(result => {
      res.render("list-search-parts", {
        title: "search",
        result,
        maxPrice,
        minPrice,
        make,
        model,
        year,
        location,
        page
      });
    });
  }
});

// change state
router.post("/changestate/:state/:id", ensureAuthenticated, (req, res) => {
  CarParts.findById(req.params.id).then(c => {
    if (req.user.id == c.user) {
      CarParts.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { state: req.params.state } },
        { new: true }
      ).exec((err, carpart) => {
        if (err) {
          return res.json({ status: "false" });
        } else {
          return res.json({ status: "true" });
        }
      });
    }
  });
});

//part edit page
router.get("/edit/:id", (req, res) => {
  CarParts.findById(req.params.id)
    .populate("make")
    .then(car => {
      if (req.user.id == car.user) {
        res.render("form-edit-part", {
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

  if (req.body.name) carFields.name = req.body.name;
  if (req.body.make) carFields.make = req.body.make;
  if (req.body.model) carFields.model = req.body.model;
  if (req.body.year) carFields.year = req.body.year;
  if (req.body.price) carFields.price = req.body.price;
  if (req.body.description) carFields.description = req.body.description;
  if (req.body.location) carFields.location = req.body.location;

  CarParts.findOneAndUpdate(
    { _id: req.params.id },
    { $set: carFields },
    { new: true }
  ).then(car => {
    req.flash("success", "Car Part information have been upadated");
    res.redirect("/parts/myvehicleparts");
  });
});

//delete a car
router.delete("/delete/:id", function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = { _id: req.params.id };

  CarParts.findById(req.params.id, function(err, car) {
    if (car.user != req.user.id) {
      res.status(500).send();
    } else {
      car.pics.forEach(function(element) {
        fs.unlink("./public/uploads/partpics/" + element, err => {
          if (err) throw err;
        });
      });

      CarParts.deleteOne(query, function(err) {
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
