const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // check user is loggedIn or not
    const loggedInUser = req.user;
    // finding in DB
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      //   getting only pending(interested) requests
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    //   OR
    // }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "Data fetched succesfuly!!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
