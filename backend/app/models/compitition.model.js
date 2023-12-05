const mongoose = require("mongoose");

const Compitition = mongoose.model(
  "Compitition",
  new mongoose.Schema({
    compititionName: {
        type: String,
        unique : true,
        required: true
    },
    organiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    shortCode: {
        type: String,
        required: true
    },
    compititionLogo: {
        type: String,
        required: false
    },
    compititionSettings: {
        type: String,
        required: false
    },
    compititionSeason: {
        type: String,
        default: "2020/2021",
        required: false  
    },
    compititionCountry: {
        type: String,
        default: "ae",
        required: false
    },
    compititionYear:{
        type: Date,
        default: "2023/2024",
        required: false
    },
    compititionEnd:{
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

module.exports = Compitition;