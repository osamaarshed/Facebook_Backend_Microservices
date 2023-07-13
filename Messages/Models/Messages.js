const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    chatRoomId: { type: String, required: true },
    participants: {
      type: ["ObjectId"],
      ref: "User",
      required: true,
      validate: {
        validator: function (array) {
          const desiredLength = 2;
          return array.length === desiredLength;
        },
        message: "Cannot be greater than 2 ",
      },
    },

    messages: [
      {
        sentBy: { type: "ObjectId", ref: "User", required: true },
        text: { type: "String", required: true },
        timeStamp: { type: String },
      },
    ],
  },
  {
    collection: "Messages",
  }
);
const Messages = mongoose.model("Messages", messagesSchema);
module.exports = Messages;
