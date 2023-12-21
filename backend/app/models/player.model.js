const mongoose = require("mongoose");

const Player = mongoose.model(
  "Player",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dob: {
      type: Number,
      required: true
    },
    shortcode: {
      type: String
    },
    gender: {
      type: String,
      required: true
    },
    squadNo: {
      type: Number,
      required: true
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League"
    },
    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Academy"
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    playerNo: {
      type: Number,
      unique: true,
      required: true
    },
    emiratesIdNo: {
      type: String,
      required: true
    },
    eidFront: {
      type: String,
      default: null,
      required: false
    },
    eidBack: {
      type: String,
      default: null,
      required: false
    },
    playerImage: {
      type: String,
      default: null,
      required: false
    },
    playerStatus: {
      type: String,
      default: null,
      required: false
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition"
    },
    playingUp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: false
      }
    ],
    playingUpTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: false
      }
    ],
    mvp: {
      type: Boolean,
      default: false
    },
    user: {
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

module.exports = Player;
