const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get("/", async (req, res) => {
  const category = await Category.find();
  if (!category) {
    return res.status(500).json({
      data: [],
      success: false,
    });
  }
  return res.status(200).json({
    data: category,
    success: true,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(500).json({
        data: {},
        success: false,
      });
    }
    return res.status(200).json({
      data: category,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      data: { message: "There seems to be a problem please try again later" },
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    });
    category = await category.save();
    if (!category) {
      return res.status(404).send("The category cannot be created");
    }
    return res.send(category);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error fetching data", success: false });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    if (!category) {
      return res.status(404).send("The category cannot be updated");
    }
    return res.send({
      message: "Category updated successfully",
      success: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There seems to be a problem please try again later",
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const categoryId = req.params.id;
  Category.findByIdAndDelete(categoryId)
    .then((value) => {
      if (value) {
        return res.send({
          success: true,
          message: "The category is deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Category not found!",
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
