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
    "mongodb://nehabhojwani:neha123@ac-ol3dtwx-shard-00-00.j3nai6l.mongodb.net:27017,ac-ol3dtwx-shard-00-01.j3nai6l.mongodb.net:27017,ac-ol3dtwx-shard-00-02.j3nai6l.mongodb.net:27017/?ssl=true&replicaSet=atlas-u22s1a-shard-0&authSource=admin&retryWrites=true&w=majority",
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
  newUser.save().
    then(() => {
      res.status(200).json({ message: "User registered Successfully" });
    }).catch((err) => {
      console.log("Error registering user", err);
      res.status(500).json({ message: "Error registering user" });
    });
});
