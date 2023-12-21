const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    contact: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    shortcode: {
      type: String,
      required: true
    },
    competition: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competition"
      }
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: false
    }
  })
);

module.exports = User;
