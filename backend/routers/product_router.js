const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

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
router.get(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("Invalid product");
  }
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(500).json({
      data: [],
      success: false,
    });
  }
  return res.status(200).json(product);
});

router.post(`/`, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.body.category)) {
      return res.status(404).send("Invalid category id to update");
    }

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

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("Invalid product");
  }

  if (!mongoose.isValidObjectId(req.body.category)) {
    return res.status(404).send("Invalid category id to update");
  }

  let product = await Product.findByIdAndUpdate(req.params.id, {
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
  if (!product) {
    return res.status(500).send("The product cannot be updated");
  }
  return res.send({
    message: "Product updated successfully",
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  Product.findByIdAndDelete(productId)
    .then((value) => {
      if (value) {
        return res.send({
          success: true,
          message: "The Product is deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Product not found!",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json({ message: "Error doing operation", success: false });
    });
});

module.exports = router;
