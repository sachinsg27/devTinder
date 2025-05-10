const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

const USER_SAFE_DATA = "firstName lastName skills";

// Getting data of received requests

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    // check user is loggedIn or not
    const loggedInUser = req.user;
    // finding in DB
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      //   getting only pending(interested) requests
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
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

// Getting data of all connections

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Creating Feed API

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // check user is loggedIn or not
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all connection Requests(sent + recieved)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Find users who should not see on feed(hide User profile)
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // find all remaining Users in DB(who is not present in hideUsersFromFeed) && loggedInUser himself
    // $nin - not in (To match values in an Array)
    // $ne - not equal to
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
