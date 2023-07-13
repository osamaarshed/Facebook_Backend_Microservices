const express = require("express");
const router = express.Router();
const {
  showComments,
  createComments,
  updateComments,
  deleteComment,
} = require("../Controllers/comment-controller");

//Show
router.get("/:postId", showComments);

//Create
router.post("/", createComments);

//Update
router.put("/", updateComments);

//Delete
router.delete("/:postId", deleteComment);

module.exports = router;
