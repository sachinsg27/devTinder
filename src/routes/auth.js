const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const user = new User(req.body);

  try {
    // validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // encrypting a password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is not present in DB");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a JWT Token
      const token = await user.getJWT();

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
module.exports = authRouter;
