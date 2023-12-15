const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({});

const order = mongoose.model("order", orderSchema);

module.exports = order;
