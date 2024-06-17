const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image:{
  type:String,
  required:true,
  },
  email: {
    type: String,
    unique: true,
    required: true,

  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
}
});

const Admin = model("Admin", adminSchema);
module.exports = Admin;
