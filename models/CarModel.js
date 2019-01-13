const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CarModelSchema = new Schema({
  make: {
    type: Schema.Types.ObjectId,
    ref: "carmakes"
  },
  modName: {
    type: String,
    required: true
  }
});

module.exports = CarModel = mongoose.model("carmodels", CarModelSchema);
