const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + "sent connection request");
});

module.exports = requestRouter;
