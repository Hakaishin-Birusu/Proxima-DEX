const mongoose = require("mongoose");

let history = new mongoose.Schema({
  userAddress: { type: String, required: true, unique: false },
  activity: { type: String, required: true, unique: false },
  hash: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("txHistory", history);
