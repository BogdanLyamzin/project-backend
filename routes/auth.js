const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const createPayload = (user) => ({
  user: {
    email: user.email,
    id: user._id,
  },
});

// Регистрация пользователя
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email already exist" });
    }

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "Register successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
});

// Авторизация пользователя
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ore password invalid" });
    }

    const payload = createPayload(user);

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Замените на ваш секретный ключ
      { expiresIn: "1h" }
    );

    res.json({
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
