Points

1. Social Media application using MEAN stack.
2. User can login and register also there is otp verification, user cannot access his/her page without proper login and register.
3. User can create a post and can add comments to that post.
4. User can add as many friends he want to and we get notification when a user send request to another user.
5. User can like a post and can see the list of people who liked that post.
6. User can search for a user by name and can see the list of users who match the searched user.
7. User can see the list of posts of his/her friends and can see the list of posts.
8. Private user posts can't be visible to other users if they are not friends.
9. User can chat with their friends and there is also the functionality of group chat.
10. Paging is applied to every page.
11. Debouncing is applied to search fields.
12. Authentication is done using JWT tokens.


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