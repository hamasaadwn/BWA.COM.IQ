const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CarMakeSchema = new Schema({
  makeName: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

module.exports = CarMake = mongoose.model("carmakes", CarMakeSchema);
