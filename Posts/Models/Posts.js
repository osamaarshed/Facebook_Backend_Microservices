const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    likes: [{ type: "ObjectId", ref: "User" }],
    comments: [{ type: "ObjectId", ref: "Comments" }],
    shares: { type: Number, default: 54 },
    userId: { type: "ObjectId", ref: "User" },
    postDescription: { type: String, required: true },
    inputFile: { type: String, required: true },
  },
  {
    collection: "Posts",
  }
);
const Posts = mongoose.model("Posts", postsSchema);
module.exports = Posts;
