const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const CarPartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  make: {
    type: Schema.Types.ObjectId,
    ref: "carmakes"
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  pics: [String],
  view: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    default: "active"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

CarPartSchema.plugin(mongoosePaginate);
module.exports = CarParts = mongoose.model("parts", CarPartSchema);
