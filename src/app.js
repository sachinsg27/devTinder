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

app.get("/", (req, res) => {
  res.send("Welcome to Dashboard");
});

app.post("/test", (req, res) => {
  res.send("Welcome to Testing");
});

app.delete("/hello", (req, res) => {
  res.send("Hello Hello Hello");
});

app.listen("7777", () => {
  console.log("Server listening on port 7777...!");
});
