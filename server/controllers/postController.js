const { commentsModel } = require("../models/commentsModel");
const friendsModel = require("../models/friendReqModel");
const { postsModel } = require("../models/postsModel");
const { userModel } = require("../models/userModel");
const { RESPONSE_MSGS } = require("../utils/constants");

const createPost = async (payload) => {
  try {
    const { file, caption, taggedPeople, userId } = payload;
    const post = {
      caption: caption,
      taggedPeople: taggedPeople || [],
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

const feedForUser = async (payload) => {
  try {
    const { userId } = payload;
    const posts = await postsModel.find({}).populate("userUploaded", ["username", "profilePicture"]);

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
      data: filteredPosts,
    };
  } catch (error) {
    console.log("ERROR IS:", error);
    return {
      statusCode: 500,
      data: RESPONSE_MSGS.INTERNAL_SERVER_ERR,
    };
  }
};

module.exports = {
  createPost,
  getPosts,
  addAComment,
  tagUsers,
  feedForUser,
};
