const { groupModel } = require("../models/chatModels/groupModel");
const { roomModel } = require("../models/chatModels/roomsModel");
const { RESPONSE_MSGS } = require("../utils/constants");
const { ObjectId } = require("mongoose").Types;

const createGroup = async (payload) => {
  const { groupName } = payload;

  const createGrp = await groupModel.create({
    groupName: groupName,
  });
  return {
    statusCode: 200,
    data: {
      message: RESPONSE_MSGS.SUCCESS,
      data: createGrp,
    },
  };
};

const getUserGroups = async (payload) => {
  const { userId } = payload;

  const getGroups = await roomModel.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
      },
    },
    {
      $addFields: {
        converted_roomId: {
          $convert: {
            input: "$roomName",
            to: "objectId",
            onError: "$$REMOVE",
            onNull: "$$REMOVE",
          },
        },
      },
    },
    {
      $lookup: {
        from: "groups",
        localField: "converted_roomId",
        foreignField: "_id",
        as: "matchedGroup",
      },
    },
    {
      $unwind: { path: "$matchedGroup" },
    },
    {
      $project: {
        roomName: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
        groupName: "$matchedGroup.groupName",
        groupId: "$matchedGroup._id",
      },
    },
    {
      $group: {
        _id: "$groupId",
        roomName: { $first: "$roomName" },
        user: { $first: "$user" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        groupName: { $first: "$groupName" },
        groupId: { $first: "$groupId" },
      },
    },
  ]);

  return {
    statusCode: 200,
    data: getGroups,
  };
};

module.exports = { createGroup, getUserGroups };
