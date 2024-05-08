const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./Schemas/UserSchema.js");
const Thread = require("./Schemas/ThreadSchema.js");
const bcrypt = require("bcryptjs");
const validator = require("validator");
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

  if (!validator.isEmail(email)) {
    console.log("Failed email validation");
    return res.status(400).send("Invalid email format.");
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    console.log("Failed password validation");
    return res
      .status(400)
      .send(
        "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
      );
  }
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
app.post("/add/thread", async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .send("Missing title, content, or user ID. All fields are required.");
  }

  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).send("User not found.");
    }

    const newThread = new Thread({
      userId,
      title,
      content,
      likes: [],
      dislikes: [],
    });

    const savedThread = await newThread.save();
    res.status(201).json({
      message: "Thread created successfully",
      thread: savedThread,
    });
  } catch (error) {
    console.error("Error creating a new thread: ", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/get/threads", async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate("userId", "name")
      .sort({ createdDate: -1 });
    res.json(threads);
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    res.status(500).send("Failed to fetch threads");
  }
});
app.get("/get/thread/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate(
      "userId",
      "name"
    );
    if (!thread) {
      return res.status(404).send("Thread not found");
    }
    res.json(thread);
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    res.status(500).send("Server error during fetching thread");
  }
});

app.patch("/like-thread/:id", async (req, res) => {
  const { userId } = req.body;

  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).send("Thread not found");
    }
    const likedIndex = thread.likes.indexOf(userId);
    const dislikedIndex = thread.dislikes.indexOf(userId);

    if (likedIndex === -1) {
      if (dislikedIndex !== -1) {
        thread.dislikes.splice(dislikedIndex, 1);
      }
      thread.likes.push(userId);
    }

    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    console.error("Error liking thread: ", error);
    res.status(500).send("Internal Server Error");
  }
});
app.patch("/dislike-thread/:id", async (req, res) => {
  const { userId } = req.body;

  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).send("Thread not found");
    }
    const likedIndex = thread.likes.indexOf(userId);
    const dislikedIndex = thread.dislikes.indexOf(userId);

    if (dislikedIndex === -1) {
      if (likedIndex !== -1) {
        thread.likes.splice(likedIndex, 1);
      }
      thread.dislikes.push(userId);
    }

    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    console.error("Error disliking thread:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
