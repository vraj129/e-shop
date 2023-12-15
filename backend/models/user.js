const mongoose = require("mongoose");

const userSchema = mongoose.Schema({});

const user = mongoose.model("users", userSchema);

module.exports = user;
