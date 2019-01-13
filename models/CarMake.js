const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CarMakeSchema = new Schema({
  makeName: {
    type: String,
    required: true
  }
});

module.exports = CarMake = mongoose.model("carmakes", CarMakeSchema);
