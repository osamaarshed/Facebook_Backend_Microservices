const express = require("express");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");
const User = require("../Models/UserModel");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

const showPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find({
      $or: [{ userId: req.user }, { _id: req.query.postId }],
    });

    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      const formattedData = posts.map((object) => {
        return {
          ...object._doc,
          likesCount: object.likes.length,
        };
      });

      await res.status(200).send({
        message: "Success",
        post: formattedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

const showOthersPosts = async (req, res, next) => {
  const limit = 4;
  const skip = req.query.page * limit || 0;
  try {
    const [user] = await User.find({ _id: req.user });
    const posts = await Posts.find({ userId: { $in: user.friends } })
      .populate("userId")
      // .populate("comments")
      .populate("likes")
      .skip(skip)
      .limit(limit);
    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      const formattedData = posts.map((object) => {
        return { ...object._doc, likesCount: object.likes.length };
      });
      await res.status(200).send(formattedData);
    }
  } catch (error) {
    next(error);
  }
};

const createPost = (req, res, next) => {
  try {
    Posts.create({
      likes: [],
      comments: [],
      userId: req.user,
      postDescription: req.body.postDescription,
      inputFile: req.file ? req.file.filename : null,
    }).then(() => {
      res.status(201).send({ message: Success_Messages.Created });
    });
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    if (req.body.like === "true") {
      const post = await Posts.findOneAndUpdate(
        { _id: req.body.postId },
        {
          $addToSet: { likes: req.user },
        },
        { new: true }
      );
      const formattedData = { ...post._doc, likesCount: post.likes.length };

      await res.status(200).send({ message: "Liked", post: formattedData });
    } else if (req.body.like === "false") {
      const data = await Posts.findOne({
        _id: req.body.postId,
      });
      if (data.likes.includes(req.user)) {
        const post = await Posts.findOneAndUpdate(
          { _id: req.body.postId },
          {
            $pull: { likes: req.user },
          },
          { new: true }
        );
        const formattedData = { ...post._doc, likesCount: post.likes.length };
        await res
          .status(200)
          .send({ message: "Disliked", post: formattedData });
      } else {
        const formattedData = { ...data._doc, likesCount: data.likes.length };
        await res
          .status(200)
          .send({ message: "Disliked", post: formattedData });
        res
          .status(400)
          .send({ message: "invalid User Req", post: formattedData });
      }
    } else {
      res.status(400).send({ message: "Either True or False" });
    }
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    if (req.file) {
      const post = await Posts.findOneAndUpdate(
        {
          $and: [{ userId: req.user }, { _id: req.body.postId }],
        },
        {
          postDescription: req.body.postDescription,
          inputFile: req.file ? req.file.filename : null,
        }
      );
      if (post) {
        fs.unlink(`./public/images/${post.inputFile}`, function (err) {
          if (err) {
            return console.log("Error:", err);
          } else {
            console.log("Unliked");
          }
        });
        res.status(200).send({ message: Success_Messages.Update });
      } else {
        res.status(401).send({
          message: Error_Messages.Not_Found,
        });
      }
    } else {
      const post = await Posts.findOneAndUpdate(
        {
          $and: [{ userId: req.user }, { _id: req.body.postId }],
        },
        {
          postDescription: req.body.postDescription,
        }
      );
      if (post) {
        res.status(200).send({ message: Success_Messages.Update });
      } else {
        res.status(401).send({
          message: Error_Messages.Not_Found,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Posts.find({
      $and: [{ userId: req.user }, { _id: req.params.postId }],
    }).deleteOne();

    if (post.deletedCount) {
      res.status(200).send({ message: Success_Messages.Delete, user: post });
    } else {
      res.status(401).send({
        message: Error_Messages.UnAuthorized,
        user: post.deletedCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
  showOthersPosts,
};
