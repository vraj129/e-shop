const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get(`/`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    return res.status(500).json({
      data: [],
      success: false,
    });
  }
  return res.status(200).json(productList);
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
