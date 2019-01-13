const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const CarSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  make: {
    type: Schema.Types.ObjectId,
    ref: "carmakes"
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
  fuelType: {
    type: String
  },
  kmsd: {
    type: String
  },
  transmission: {
    type: String
  },
  roofType: {
    type: String
  },
  cylNo: {
    type: String
  },
  drivetrain: {
    type: String
  },
  airbags: {
    type: String
  },
  tankCap: {
    type: String
  },
  seatCap: {
    type: String
  },
  lseats: {
    type: String
  },
  hseats: {
    type: String
  },
  screen: {
    type: String
  },
  camera: {
    type: String
  },
  bluetooth: {
    type: String
  },
  starter: {
    type: String
  },
  cruise: {
    type: String
  },
  ac: {
    type: String
  },

  vehicle_type: {
    type: String,
    default: "Used"
  },
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

CarSchema.plugin(mongoosePaginate);
module.exports = Car = mongoose.model("cars", CarSchema);
