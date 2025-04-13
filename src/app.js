// const express = require("express");

// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello from the Dashboard");
// });

// app.get("/test", (req, res) => {
//   res.send("Test Test Test....");
// });

// app.listen(7777, () => {
//   console.log("Server listening on port 7777...");
// });

const express = require("express");

const app = express();

app.use("/test", (req, res, next) => {
  res.send("Welcome to Dashboard");
  // next();
});

app.use("/test", (req, res) => {
  res.send("Welcome to Testing");
});

app.get("/hello", (req, res) => {
  res.send("Hello Hello Hello");
});

app.listen("7777", () => {
  console.log("Server listening on port 7777...!");
});
