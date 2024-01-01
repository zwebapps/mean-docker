const mongoose = require("mongoose");

const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    settingsName: {
      type: String
    },
    settingsValue: {
      type: String
    }
  })
);

module.exports = Settings;
