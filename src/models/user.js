const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const alumniSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    unique: true,
    required: true,

  },
  bitRollno: {
    type: String,
    required: true,

    unique: true,
  },
  branch:{
    type:String,
    required:true
  }, admissionYear: {
    type: Number,
    required: true,

  },
  graduationYear: {
    type: Number,
    required: true,

  },
  tools: {
    type: String,
  },
  company: {
    type: String,
  },
  designation: {
    type: String,
  },
  message: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  },
  password: {
    type: String,
    required: true,
  }
});

const Alumni = model("Alumni", alumniSchema);
module.exports = Alumni;
