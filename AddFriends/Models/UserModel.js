const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
    friends: [{ type: "ObjectId", ref: "User" }],
    friendRequests: [{ type: "ObjectId", ref: "User" }],
    jwttoken: { type: String },
  },
  {
    collection: "credentials",
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
