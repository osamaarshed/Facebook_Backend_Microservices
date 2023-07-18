const express = require("express");
const router = express.Router();
const {
  showComments,
  createComments,
  updateComments,
  deleteComment,
  randomComments,
} = require("../Controllers/comment-controller");

//Show
router.get("/:postId", showComments);

//Create
router.post("/", createComments);

//Random Comments
router.post("/random", randomComments);

//Update
router.put("/", updateComments);

//Delete
router.delete("/:postId", deleteComment);

module.exports = router;
