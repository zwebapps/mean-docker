const mongoose = require("mongoose");

const League = mongoose.model(
  "League",
  new mongoose.Schema({
    leagueName: {
      type: String,
      required: true
    },
    leagueAgeLimit: {
      type: String,
      required: true
    },
    shortcode: {
      type: String
    },
    year: {
      type: String,
      default: 2024
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
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

module.exports = League;
