const express = require("express");
const {
  showMessages,
  showSpecificMessages,
  deleteMessages,
  // saveMessage,
} = require("../Controllers/messages-controller");
const router = express.Router();

//Show
router.get("/", showMessages);
router.get("/:chatRoomId/", showSpecificMessages);
router.delete("/:chatRoomId/:user", deleteMessages);

// router.post("/", saveMessage);

module.exports = router;
