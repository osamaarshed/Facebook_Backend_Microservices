const express = require("express");
const router = express.Router();
const {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
  showOthersPosts,
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

//Show Others Posts
router.get("/all", showOthersPosts);

// Like Post
router.put("/like", likePost);

//Delete Post
router.delete("/:postId", deletePost);

//Show My Posts
router.get("/", showPosts);

// Create Post
router.post("/", upload.single("inputFile"), createPost);

//Update Post
router.put("/", upload.single("inputFile"), updatePost);

module.exports = router;
