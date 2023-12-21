const mongoose = require("mongoose");

const Team = mongoose.model(
  "Team",
  new mongoose.Schema({
    teamName: {
      type: String,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    academy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Academy"
    },
    shortcode: {
      type: String
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    leagues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League"
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      required: false
    }
  })
);

module.exports = Team;
