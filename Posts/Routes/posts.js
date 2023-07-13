const express = require("express");
const router = express.Router();
const {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
  showOthersPosts,
  // putLikePost,
} = require("../Controllers/posts-controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString().slice(2, 6) + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//Show My Posts
router.get("/", showPosts);

//Show Others Posts
router.get("/all", showOthersPosts);

// Create Post
router.post("/", upload.single("inputFile"), createPost);

// Like Post
router.put("/like", likePost);

//Update Post
router.put("/", upload.single("inputFile"), updatePost);

//Delete Post
router.delete("/:postId", deletePost);

module.exports = router;
