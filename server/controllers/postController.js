const { commentsModel } = require("../models/commentsModel");
const friendsModel = require("../models/friendReqModel");
const { postsModel } = require("../models/postsModel");
const { userModel } = require("../models/userModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const createPost = async (payload) => {
  try {
    const { file, caption, taggedPeople, userId } = payload;

    console.log(payload);
    const tagged = JSON.parse(taggedPeople);
    const post = {
      caption: caption,
      taggedPeople: tagged || [],
      userUploaded: userId,
      imageOrVideo: file.path,
    };

    const created = await postsModel.create(post);

    if (!created) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILED_TO_POST,
      };
    }

    return {
      statusCode: 201,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        data: created,
      },
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const getPosts = async (payload) => {
  try {
    const { userId } = payload;

    const posts = await postsModel
      .find({ userUploaded: userId })
      .sort({ createdAt: -1 });

    return {
      statusCode: 200,
      data: posts,
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const addAComment = async (payload) => {
  try {
    const { postId, userId, comment } = payload;

    const getPost = await postsModel.findById(postId);
    if (!getPost) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.POST_NOT_FOUND,
      };
    }

    const postUserId = getPost.userUploaded;

    const friendship = await friendsModel.find({
      $and: [
        {
          $or: [
            { user: userId, friend: postUserId },
            { user: postUserId, friend: userId },
          ],
        },
        { reqAccepted: true },
      ],
    });

    if (friendship.length === 0) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.NOT_FRIENDS,
      };
    }

    const newComment = {
      comment,
      userId: userId,
      postId: postId,
    };

    const addTheComment = await commentsModel.create(newComment);

    if (!addTheComment) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILURE,
      };
    }

    const findComment = await commentsModel
      .findById(addTheComment._id)
      .populate("userId", ["username", "profilePicture"]);

    const updateComment = await postsModel.updateOne(
      { _id: postId },
      {
        $inc: { comments: 1 },
      }
    );

    return {
      statusCode: 200,
      data: {
        message: RESPONSE_MSGS.SUCCESS,
        data: findComment,
      },
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const tagUsers = async (payload) => {
  try {
    const { postId, userId, taggedUsers } = payload;
    const post = await postsModel.findById(postId);

    if (String(post.userUploaded) !== String(userId)) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.INVALID_CREDENTIALS,
      };
    }

    const prevTaggedUsers = [...post.taggedPeople];

    taggedUsers.forEach((data) => {
      prevTaggedUsers.push(data);
    });

    const updateTaggedUsers = await postsModel.updateOne(
      { _id: postId },
      { $set: { taggedPeople: prevTaggedUsers } }
    );

    if (!updateTaggedUsers) {
      return {
        statusCode: 400,
        data: RESPONSE_MSGS.FAILURE,
      };
    }

    return {
      statusCode: 200,
      data: RESPONSE_MSGS.SUCCESS,
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

const { ObjectId } = require("mongoose").Types;

const feedForUser = async (payload) => {
  try {
    const { userId, length } = payload;

    const posts = await postsModel
      .aggregate([
        {
          $lookup: {
            from: "likes",
            let: { postId: "$_id", userId: new ObjectId(userId) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postId", "$$postId"] },
                      { $eq: ["$userLiked", "$$userId"] },
                    ],
                  },
                },
              },
            ],
            as: "likedOrNot",
          },
        },
        {
          $addFields: {
            liked: { $gt: [{ $size: "$likedOrNot" }, 0] },
          },
        },
        {
          $project: {
            likedOrNot: 0,
          },
        },
        {
          $lookup: {
            from: "comments",
            let: { postId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$postId", "$$postId"],
                  },
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: { userId: "$userId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$userId"],
                        },
                      },
                    },
                    {
                      $project: { username: 1, profilePicture: 1 },
                    },
                  ],
                  as: "userDetails",
                },
              },
              {
                $project: { userId: 0, postId: 0, createdAt: 0 },
              },
              {
                $limit: 4,
              },
            ],
            as: "comments",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .exec();

    await postsModel.populate(posts, {
      path: "userUploaded",
      select: ["username", "profilePicture"],
    });

    const updatedPosts = await Promise.all(
      posts.map(async (data) => {
        const { userUploaded } = data;
        const friends = await friendsModel.find({
          $and: [
            {
              $or: [
                { user: userId, friend: userUploaded._id },
                { user: userUploaded._id, friend: userId },
              ],
            },
            { reqAccepted: true },
          ],
        });

        if (friends.length === 0) {
          return null;
        } else {
          return data;
        }
      })
    );

    const filteredPosts = updatedPosts.filter((post) => post !== null);

    return {
      statusCode: 200,
      data: filteredPosts.slice(length, length + 4),
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};
const getCommentsOfPost = async (payload) => {
  const { postId, length } = payload;

  const getComments = await commentsModel
    .find({
      postId: postId,
    })
    .sort({ createdAt: 1 })
    .skip(length)
    .limit(5)
    .populate("userId", ["username", "profilePicture"]);

  return {
    statusCode: 200,
    data: getComments,
  };
};

const getUserSinglePost = async (payload) => {
  const { postId } = payload;

  const find = await postsModel
    .find({ _id: postId })
    .populate("userUploaded", ["username", "profilePicture"]);

  if (find.length < 1) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.POST_NOT_FOUND,
    };
  }

  return {
    statusCode: 200,
    data: find,
  };
};

const updatePost = async (payload) => {
  const { file, caption, postId, userId } = payload;
  const findPost = await postsModel.find({ _id: postId, userUploaded: userId });

  if (findPost.length < 1) {
    return {
      statusCode: 404,
      data: RESPONSE_MSGS.POST_NOT_FOUND,
    };
  }

  const updatePost = await postsModel.updateOne(
    { _id: postId },
    {
      $set: {
        caption: caption ? caption : findPost.caption,
        imageOrVideo: file ? file.path : findPost.imageOrVideo,
      },
    }
  );

  if (updatePost) {
    return {
      statusCode: 200,
      data: RESPONSE_MSGS.SUCCESS,
    };
  }
};

module.exports = {
  createPost,
  getPosts,
  addAComment,
  tagUsers,
  feedForUser,
  getCommentsOfPost,
  getUserSinglePost,
  updatePost,
};
