const express = require("express");
const Messages = require("../Models/Messages");
const mongoose = require("mongoose");

//Show All Messages
const showMessages = async (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const userId = new ObjectId(req.user);
  try {
    const messages = await Messages.aggregate([
      {
        $match: {
          $expr: {
            $in: [userId, "$participants"],
          },
        },
      },
      {
        $project: {
          chatRoomId: 1,
          participants: 1,
          messages: 1,
        },
      },

      {
        $lookup: {
          from: "credentials",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $unwind: "$messages",
      },

      {
        $lookup: {
          from: "credentials",
          localField: "messages.sentBy",
          foreignField: "_id",
          as: "messages.sentBy",
        },
      },
      {
        $unwind: "$messages.sentBy",
      },
      {
        $group: {
          _id: "$_id",
          chatRoomId: { $first: "$chatRoomId" },
          participants: { $first: "$participants" },
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (messages.length) {
      res.status(200).send({
        message: "SuccessFully Fetched",
        chats: messages,
      });
    } else {
      res.status(400).send({ message: "No Chats" });
    }
  } catch (error) {
    next(error);
  }
};

// Show Specific Messages
const showSpecificMessages = async (req, res, next) => {
  const queryPage = parseInt(req.query.page);
  const page = queryPage * 10 || 10;
  const limit = 10;
  try {
    const messages = await Messages.aggregate([
      {
        $match: {
          chatRoomId: req.params.chatRoomId,
        },
      },
      {
        $project: {
          chatRoomId: 1,
          participants: 1,
          messages: {
            $slice: ["$messages", -page, limit],
          },
        },
      },
      {
        $lookup: {
          from: "credentials",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $unwind: "$messages",
      },

      {
        $lookup: {
          from: "credentials",
          localField: "messages.sentBy",
          foreignField: "_id",
          as: "messages.sentBy",
        },
      },
      {
        $unwind: "$messages.sentBy",
      },
      {
        $group: {
          _id: "$_id",
          chatRoomId: { $first: "$chatRoomId" },
          participants: { $first: "$participants" },
          messages: { $push: "$messages" },
        },
      },
    ]);
    if (messages.length) {
      res.status(200).send({
        message: "SuccessFully Fetched",
        chats: messages,
      });
    } else {
      res.status(400).send({ message: "No Chats" });
    }
  } catch (error) {
    next(error);
  }
};

// Delete Messages
const deleteMessages = async (req, res, next) => {
  const id = req.query.messages_id;
  try {
    const message = await Messages.findOneAndUpdate(
      {
        chatRoomId: req.params.chatRoomId,
      },
      {
        $pull: {
          messages: {
            sentBy: req.params.user,
            _id: id,
          },
        },
      },
      { new: true }
    );
    if (message) {
      console.log("Deleted: ");
      res.send({ RES: message });
    } else {
      console.log("Not deleted");
      res.send({ RES: message });
    }
  } catch (error) {
    next(error);
  }
};

//Save Messages
const saveMessages = async (data) => {
  try {
    const chatId = await Messages.findOne({
      chatRoomId: data.chatRoomId,
    });
    if (!chatId) {
      const res = await Messages.create({
        chatRoomId: data.chatRoomId,
        participants: [data.participant1, data.participant2],
        messages: [
          {
            sentBy: data.messageOwner,
            text: data.text,
            timeStamp: data.time,
          },
        ],
      });
      if (res) {
        console.log("Message Sent");
        return res;
      } else {
        console.log("Bad Request in ifelse");
      }
    } else {
      const payload = {
        sentBy: data.messageOwner,
        text: data.text,
        timeStamp: data.time,
      };
      await Messages.findOneAndUpdate(
        {
          chatRoomId: data.chatRoomId,
        },
        {
          $push: { messages: payload },
        },
        { new: true }
      );
      const addMessage = await Messages.aggregate([
        {
          $match: {
            chatRoomId: data.chatRoomId,
          },
        },
        {
          $project: {
            _id: 1,
            chatRoomId: 1,
            participants: 1,
            messages: 1,
          },
        },
        {
          $lookup: {
            from: "credentials",
            localField: "participants",
            foreignField: "_id",
            as: "participants",
          },
        },
        {
          $unwind: "$messages",
        },
        {
          $lookup: {
            from: "credentials",
            localField: "messages.sentBy",
            foreignField: "_id",
            as: "messages.sentBy",
          },
        },
        {
          $unwind: "$messages.sentBy",
        },
        {
          $group: {
            _id: "$_id",
            chatRoomId: { $first: "$chatRoomId" },
            participants: { $first: "$participants" },
            messages: { $push: "$messages" },
          },
        },
      ]);
      if (addMessage.length) {
        console.log("Add Message: ", addMessage);
        return addMessage;
      } else {
        console.log("Bad Request");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  showMessages,
  showSpecificMessages,
  saveMessages,
  deleteMessages,
};
