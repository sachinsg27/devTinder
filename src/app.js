const express = require("express");
const connectDB = require("./database");

const app = express();
const User = require("./model.js/users");
const users = require("./model.js/users");
app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("User not added...");
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong..");
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
