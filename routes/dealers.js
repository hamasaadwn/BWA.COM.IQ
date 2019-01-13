const express = require("express");
const router = express.Router();

// Bring in profile Model
let Profile = require("../models/Profile");
const Car = require("../models/Car");

router.get("/", (req, res) => {
  let page = 1;
  if (req.query.page != undefined || req.query.page != null) {
    page = parseInt(req.query.page);
  }
  Profile.paginate({ state: "active" }, { page: page, limit: 15 }).then(
    result => {
      res.render("list-dealers", {
        title: "dealers",
        result
      });
    }
  );
});

router.get("/profile/:id", (req, res) => {
  Profile.findById(req.params.id)
    .populate("user", "_id")
    .then(pro => {
      Car.find({
        $and: [
          { user: pro.user._id },
          { $or: [{ state: "active" }, { state: "promoted" }] }
        ]
      }).then(cars => {
        res.render("profile-dealer", {
          title: pro.company,
          pro,
          cars
        });
      });
    });
});

module.exports = router;
