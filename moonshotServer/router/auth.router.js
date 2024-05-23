const express = require("express");
const User = require("../models/user.module");
const { signup, login } = require("../controller/auth.controller");
const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
