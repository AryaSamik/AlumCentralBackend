const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const messageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    reqired: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    reqired: true
  },
  message: {
    type: String,
    required: true
  }
}, {timestamps: true});
  
const Message = model("Message", messageSchema);
module.exports = Message;
  