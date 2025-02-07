const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const mongoose= require('mongoose');
const app = express();
const port = 3010;

app.use(express.json());

const bcrypt = require("bcryptjs");
const User = require("./models/User"); 

mongoose.connect(process.env.URI)
.then(() => console.log("Connected successfully"))
  .catch(err => console.error("Connection error:", err));


app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Server Error:", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Serving running on at http://localhost:${port}`);
});


