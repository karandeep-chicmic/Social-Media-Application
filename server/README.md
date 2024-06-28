All Api Routes:

userRoutes = {
    login: ["POST", "/user/login"],
    register: ["POST" , "/user/register"],
    getUserDetails :["GET", "/user/:friendId]"
    getOwnDetails: ["GET", "/userDetails]",
    searchUsersOnSearchText: ["GET", "/searchUsers/:searchText"]
}

postRoutes = {
    createPost: ["POST", "/createPosts"],
    getPosts: ["GET", "/getPosts"],
    addAComment: ["POST", "/addComment"],
    tagUsers: [ "POST", "/tagUsers"],
    feedForUser :[ "GET", "/feedForUser"]
}

otpRoutes = {
    sendOtp: [ "POST", "/otp" ],
    verifyOtp: [ "POST", "/verifyOtp" ]
}


likesRoutes = {
    likePost: [ "POST", "/likes" ],
}

friendRoutes = {
    addAFriend :[ "POST", "/sendRequest"],
    acceptFriendRequest : [ "PUT", "/acceptRequest"],
    getFriendList : ["GET", "/getFriendList"],
    friendOrNot : ["GET", "/friendsOrNot/:friendId"]
}