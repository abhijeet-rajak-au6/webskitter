const { createOne } = require("./handleFactory");
const Response = require("../util/responseHandler");
const AppError = require("../util/appErrorHandler");
const postModel = require("../model/Post");
const userModel = require("../model/User");
const mongoose = require("mongoose");
module.exports = {
  async addPost(req, _, next) {
    try {
      const payload = { ...req.body, userId: req.user.id };
      const newPost = await createOne(postModel, payload);
      if (!newPost)
        throw new AppError("Problem in creating post please try again", 500);
      req.locals = new Response("post created sucessfully", 201);
      next();
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },

  async getUserPost(req, res, next) {
    try {
      const userPosts = await userModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.user.id) },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "Posts",
          },
        },
        {
          $unwind: "$Posts",
        },
        {
          $project: {
            name: 1,
            "Posts.title": 1,
            "Posts.description": 1,
          },
        },
        {
          $group: {
            _id: "$name",
            posts: { $push: "$Posts" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            posts: "$posts",
          },
        },
      ]);
      if (!userPosts.length) throw new AppError("No post found !", 404);

      req.locals = new Response("posts", 200, { userPosts });
      next();
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },

  async getAllUserPosts(req, res, next) {
    try {
      const userAllPosts = await userModel.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "Posts",
          },
        },
        {
          $unwind: "$Posts",
        },
        {
          $project: {
            name: 1,
            "Posts.title": 1,
            "Posts.description": 1,
          },
        },
        {
          $group: {
            _id: { name: "$name", id: "$_id" },
            posts: { $push: "$Posts" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            posts: "$posts",
          },
        },
      ]);
      if (!userAllPosts.length) throw new AppError("No user post found !", 404);
      req.locals = new Response("users post", 200, { userAllPosts });
      next();
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },
};
