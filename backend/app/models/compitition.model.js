const mongoose = require("mongoose");

const Team = mongoose.model(
  "Compitition",
  new mongoose.Schema({
    compititionName: {
        type: String,
        unique : true,
        required: true
    },
    organiserDetail: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        unique : true,
        required: true
    },
    compititionLogo: {
        type: String,
        required: true
    },
    compititionSettings: {
        type: String,      
        required: true
    },
    compititionSeason: {
        type: String,      
        required: true
    },
    compititionStart:{
        type: Date,
        default: Date.now,
        required: true
    },
    compititionEnd:{
        type: Date,
        default: Date.now,
        required: true
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

module.exports = Team;