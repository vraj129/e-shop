const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({});

const category = mongoose.model("categories", categorySchema);

module.exports = category;
