const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  company: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "default.jpg"
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    }
  },
  website: {
    type: String
  },
  socialLinks: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    youtube: {
      type: String
    }
  },
  info: {
    type: String
  },
  profileType: {
    type: String,
    default: "user"
  },
  state: {
    type: String,
    default: "req"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ProfileSchema.plugin(mongoosePaginate);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
