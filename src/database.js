// const URI =
//   "mongodb+srv://sachinsg2705:V3SwPYI6WWzf44eb@namastenode.thfhmax.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode";

// pass = V3SwPYI6WWzf44eb;

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sachinsg2705:V3SwPYI6WWzf44eb@namastenode.thfhmax.mongodb.net/devTinder?retryWrites=true&w=majority&appName=NamasteNode"
  );
};

module.exports = connectDB;
