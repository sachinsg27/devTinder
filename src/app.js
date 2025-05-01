const express = require("express");
const connectDB = require("./database");

const app = express();
const User = require("./models/users");
const users = require("./models/users");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
// signup the user using email and password
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const user = new User(req.body);

  try {
    // validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // encrypting a password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    // creating new instence
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is not present in DB");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create a JWT Token

      const token = await jwt.sign({ _id: user._id }, "DEVloper@27");

      // Add the Token to cookie and send response back to user

      res.cookie("token", token);

      res.send("Login Succesfull!!");
    } else {
      throw new Error("password is incorrect");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
app.post("/sendConnection", userAuth, async (req, res) => {
  const user = req.user;
  console.log(user);
  res.send(user.firstName + "sent connection request");
});

connectDB()
  .then(() => {
    console.log("DB Connection established....");
    app.listen("7777", () => {
      console.log("Server listening on port 7777...!");
    });
  })
  .catch((err) => {
    console.error("Couldn't connect to DB....");
  });
