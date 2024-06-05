const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found" });
  }
  res.status(200).send(user);
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send("The user cannot be updated");
    }
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    if (!user) {
      return res.status(404).send("The user cannot be updated");
    }
    return res.send({
      message: "User updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There seems to be a problem please try again later",
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(400).send("The user cannot be registered");
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("Password is wrong");
  }
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: false,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(400).send("The user cannot be registered");
  }
  res.send(user);
});

router.get("/get/count", async (req, res) => {
  User.countDocuments()
    .then((count) => {
      if (!count) {
        res.status(500).json({ success: false });
      } else {
        return res.send({
          success: true,
          data: count,
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

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((value) => {
      if (value) {
        return res.send({
          success: true,
          message: "The User is deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found!",
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
