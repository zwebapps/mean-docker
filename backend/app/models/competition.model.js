const mongoose = require("mongoose");

const Competition = mongoose.model(
  "Competition",
  new mongoose.Schema({
    competitionName: {
      type: String,
      required: true
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    shortCode: {
      type: String,
      required: true,
      unique: true
    },
    competitionLogo: {
      type: String,
      required: false
    },
    competitionSettings: {
      type: String,
      required: false
    },
    competitionSeason: {
      type: String,
      default: "2023/2024",
      required: false
    },
    competitionCountry: {
      type: String,
      default: "ae",
      required: false
    },
    competitionYear: {
      type: Date,
      default: "2023/2024",
      required: false
    },
    competitionEnd: {
      type: Date,
      default: Date.now,
      required: false
    },
    user_id: {
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

module.exports = Competition;
