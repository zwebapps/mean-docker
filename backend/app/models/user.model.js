const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    contact: String,
    email: String,
    password: String,
    compitition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compitition"
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    }
  })
);

module.exports = User;
