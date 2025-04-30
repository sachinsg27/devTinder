const express = require("express");
const connectDB = require("./database");

const app = express();
const User = require("./model.js/users");
const users = require("./model.js/users");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

app.get("/profile", async (req, res) => {
  try {
    // validate the cookie
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    // validate my token

    const decodedMessage = jwt.verify(token, "DEVloper@27");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Get user by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong..");
  }
});
// Find a user using emailId if there are multiple
app.get("/one", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    // console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(400).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// Find all users from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong..");
  }
});
// Delete user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // this will also work
    // const user = await User.findByIdAndDelete({ _id: userId });
    console.log(userId);
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// Update the data of existing user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated succesfully");
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
  }
});
app.patch("/new", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ emailId: userEmail }, data);
    res.send("User updated succesfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
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
