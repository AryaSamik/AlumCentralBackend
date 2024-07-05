const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const messageSchema = new Schema({
  participants: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Alumni",
    }
  ],
  messages: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
    }
  ]
}, {timestamps: true});
  
const Conversation = model("Conversation", messageSchema);
module.exports = Conversation;
  