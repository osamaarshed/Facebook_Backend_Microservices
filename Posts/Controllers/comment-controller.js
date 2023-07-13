const express = require("express");
const Comments = require("../Models/Comments");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");

const showComments = async (req, res, next) => {
  try {
    const comment = await Comments.find({ postId: req.params.postId })
      .populate("userId")
      .populate("postId");
    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
};

const createComments = async (req, res, next) => {
  const payload = {
    comment: req.body.comment,
    userId: req.user,
    postId: req.body.postId,
  };
  try {
    const comments = await Comments.create(payload);
    await Posts.findOneAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: comments._id } },
      { new: true }
    );
    await res.status(200).send({ message: Success_Messages.Comment, comments });
  } catch (error) {
    next(error);
  }
};

const updateComments = async (req, res, next) => {
  try {
    const [comment] = await Comments.find({
      $and: [{ userId: req.user }, { postId: req.body.postId }],
    });
    if (req.user == comment.userId) {
      await Comments.updateOne(
        { userId: req.user },
        { comment: req.body.comment },
        { new: true }
      ).then(() => {
        res.status(200).send({ message: Success_Messages.Update });
      });
    } else {
      res.status(401).send({ message: Error_Messages.UnAuthorized });
    }
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comments.findOneAndDelete({
      $and: [{ userId: req.user }, { postId: req.params.postId }],
    });
    res
      .status(200)
      .send({ message: Success_Messages.Delete, comment: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showComments,
  createComments,
  updateComments,
  deleteComment,
};
