const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const orderItem = require("../models/order_item");

router.get("/", async (req, res) => {
  const orderList = await Order.find();
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post("/", async (req, res) => {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItemModel) => {
        let newOrderItem = new orderItem({
          quantity: orderItemModel.quantity,
          product: orderItemModel.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsTemp = await orderItemsIds;

    let order = new Order({
      orderItems: orderItemsTemp,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    order = await order.save();
    if (!order) {
      return res.status(404).send("The order could not be placed");
    }
    return res.send(order);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

module.exports = router;
