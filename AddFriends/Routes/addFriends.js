const express = require("express");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  findFriend,
  showRequests,
  showFriends,
  deleteFriends,
  showPaginatedFriends,
  findAllUsers,
} = require("../Controllers/addFriends-controller");

//Show Friends

router.get("/", showFriends);
router.get("/paginated", showPaginatedFriends);

//Show Requests
router.get("/requests", showRequests);

//Find Friends
router.get("/allusers", findAllUsers);
router.get("/:email", findFriend);

//Send Request
router.post("/", sendRequest);

//Accept Request
router.post("/status", acceptRequest);

//Delete Request
router.delete("/:friendId", deleteFriends);

module.exports = router;
