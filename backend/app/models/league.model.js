const mongoose = require("mongoose");

const League = mongoose.model(
  "League",
  new mongoose.Schema({
    leagueName: {
      type: String,
      unique: true,
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
    compitition: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Compitition"
      }
    ],
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
