const express = require("express");
const connectDB = require("./database");

const app = express();
const User = require("./model.js/users");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "Virat@gmail.com",
    password: "virat@123",
  });

  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("User not added...");
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
