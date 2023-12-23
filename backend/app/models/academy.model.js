const mongoose = require("mongoose");

const Academy = mongoose.model(
  "Academy",
  new mongoose.Schema({
    academyName: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      unique: true
    },
    color: {
      type: String
    },
    shortcode: {
      type: String
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    coach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  })
);

module.exports = Academy;
