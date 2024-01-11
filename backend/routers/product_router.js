const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

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

router.post(`/`, async (req, res) => {
  try {
    var category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Category Id is not valid");
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product1 = await product.save();
    if (!product1) return res.status(500).send("The product cannot be created");
    return res.status(200).send(product1);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      data: { message: "There seems to be a problem please try again later" },
      success: false,
    });
  }
});

module.exports = router;
