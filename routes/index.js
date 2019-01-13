const express = require("express");
const router = express.Router();

const Car = require("../models/Car");

//home route
router.get("/", (req, res) => {
  Car.find({ state: "promoted" }).then(car => {
    res.render("index", {
      title: "home",
      car
    });
  });
});

router.get("/home", (req, res) => {
  res.redirect("/");
});

//error route
router.get("/about-us", (req, res) => {
  res.render("aboutus", {
    title: "about us"
  });
});

//filter search
router.get("/filtSearch", (req, res) => {
  let minPrice = parseInt(req.query.minPrice);
  let maxPrice = parseInt(req.query.maxPrice);
  let make = req.query.make;
  let model = req.query.model;
  let year = req.query.year;
  let searchType = req.query.searchType;
  let location = req.query.location;
  let page = parseInt(req.query.page);

  if (make == "") {
    Car.paginate(
      {
        $and: [
          { model: { $regex: model, $options: "i" } },
          { year: new RegExp(year, "i") },
          { vehicle_type: new RegExp(searchType, "i") },
          { location: new RegExp(location, "i") },
          { price: { $lte: maxPrice, $gte: minPrice } },
          { $or: [{ state: "active" }, { state: "promoted" }] }
        ]
      },
      { page: page, limit: 15, sort: { date: -1 } }
    ).then(result => {
      res.render("list-search", {
        title: "search",
        result,
        maxPrice,
        minPrice,
        make,
        model,
        year,
        searchType,
        location,
        page
      });
    });
  } else {
    Car.paginate(
      {
        $and: [
          { make: make },
          { model: { $regex: model, $options: "i" } },
          { year: new RegExp(year, "i") },
          { vehicle_type: new RegExp(searchType, "i") },
          { location: new RegExp(location, "i") },
          { price: { $lte: maxPrice, $gte: minPrice } },
          { $or: [{ state: "active" }, { state: "promoted" }] }
        ]
      },
      { page: page, limit: 15, sort: { date: -1 } }
    ).then(result => {
      res.render("list-search", {
        title: "search",
        result,
        maxPrice,
        minPrice,
        make,
        model,
        year,
        searchType,
        location,
        page
      });
    });
  }
});

//list cars
router.get("/list", (req, res) => {
  let searchType = req.query.l;
  let page = parseInt(req.query.page);
  Car.paginate(
    {
      $and: [
        { vehicle_type: new RegExp(searchType, "i") },
        { $or: [{ state: "active" }, { state: "promoted" }] }
      ]
    },
    { page: page, limit: 15, sort: { date: -1 } }
  ).then(result => {
    res.render("list-cars", {
      title: "search",
      result,
      searchType,
      page
    });
  });
});

//error route
router.get("/error", (req, res) => {
  res.render("404", {
    title: "error"
  });
});

module.exports = router;
