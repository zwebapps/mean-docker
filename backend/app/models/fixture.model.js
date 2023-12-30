const mongoose = require("mongoose");

const Fixture = mongoose.model(
  "Fixture",
  new mongoose.Schema({
    matchDate: {
      type: String,
      default: Date.now,
      required: true
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    homeTeamGoals: {
      type: Number,
      default: 0,
      required: true
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    awayTeamGoals: {
      type: Number,
      default: 0,
      required: true
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mvp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null
    },
    shortcode: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: false
    }
  })
);

module.exports = Fixture;
