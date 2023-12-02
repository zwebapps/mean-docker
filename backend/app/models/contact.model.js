const mongoose = require("mongoose");

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    heading: {
      type: String,      
      required: true
    },
    content: {
        type: String,       
        required: true
    },
    reply: {
      type: String,
    },
    compitition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compitition"
    },
    status: {
      type: String,
      default : 'Pending'
    },
    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
  })
);

module.exports = Contact;