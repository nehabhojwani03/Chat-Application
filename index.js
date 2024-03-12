const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const colors = require("colors");

const app = express();
const port = 8001;
const cors = require("cors");
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(passport.initialize());

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://nehabhojwani:neha123@cluster0.j3nai6l.mongodb.net/?retryWrites=true&w=majority"
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => {
    console.log("Connected to MongoDB!".cyan.bold);
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server running on port 8001".green.bold);
});

const User = require("./models/user");
const message = require("./models/message");

//endpoint for registration of the user
app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  //create a new user object
  const newUser = new User({ name, email, password, image });

  //save user to database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered Successfully" });
    })
    .catch((err) => {
      console.log("Error registering user", err);
      res.status(500).json({ message: "Error registering user" });
    });
});

//function for creating a token for the user
const createToken = (userId) => {
  //set the token payload
  const payload = {
    userId: userId,
  };

  //Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%ZK", {expiresIn: "1h"});
  return token;
};

//endpoint for logging in  the user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if email and password are provided
  if (!email || !password) {
    return res.status(404).json({ message: "Email and password are required" });
  }

  //check for that user in the backend
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //User not found
        return res.status(401).json({ message: "User not found" });
      }

      //compare the provided password with the actual password
      if (user.password !== password) {
        return res.status(401).json({ message: "Password invalid" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("Error in finding the user", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
