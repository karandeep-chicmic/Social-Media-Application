const { likesModel } = require("../models/likesModel");
const { RESPONSE_MSGS } = require("../utils/constants");
const { postsModel } = require("../models/postsModel");

const likeAPost = async (payload) => {
  try {
    const { postId, userId } = payload;
    const like = await likesModel.findOne({
      postId: postId,
      userLiked: userId,
    });

    if (like) {
      return { statusCode: 400, data: RESPONSE_MSGS.ALREADY_LIKED };
    }

    const liked = await likesModel.create({
      postId: postId,
      userLiked: userId,
    });
    const increaseLike = await postsModel.updateOne(
      {
        _id: postId,
      },
      {
        $inc: { likes: 1 },
      }
    );

    if (!liked || !increaseLike) {
      return { statusCode: 500, data: RESPONSE_MSGS.INTERNAL_SERVER_ERR };
    }
    return { statusCode: 200, data: RESPONSE_MSGS.LIKE_POST };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, data: RESPONSE_MSGS.INTERNAL_SERVER_ERR };
  }
};

module.exports = { likeAPost };
