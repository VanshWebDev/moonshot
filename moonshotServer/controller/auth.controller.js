const User = require("../models/user.module");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ username: username });

    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    } else {
      // User does not exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10); // hash the password
      user = new User({ username: username, password: hashedPassword });
      await user.save();
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  try {
    let user = await User.findOne({ username: username });
    // const username = user.username;
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "10h" }
        );
        return res
          .status(200)
          .json({ message: "Login successful", token, username });
      } else {
        return res.status(400).json({ message: "Invalid password" });
      }
    } else {
      return res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
};
