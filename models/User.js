const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  role: {
    type: String,
    default: "user"
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  userid: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = User = mongoose.model("users", UserSchema);
