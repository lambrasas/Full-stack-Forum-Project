const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./Schemas/UserSchema.js");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send("User already exists with that email.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved:", savedUser);
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send(error.message);
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).send("Authentication failed: No user found.");
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).send("Authentication failed: Incorrect password.");
    }
    res.status(200).send(foundUser);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error during authentication.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
