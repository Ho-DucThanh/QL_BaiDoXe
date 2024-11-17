const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },
  rfid: { type: String, require: true, unique: true },
  admin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

