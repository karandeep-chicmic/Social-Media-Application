export const ROUTES_UI = {
  DEFAULT: '',
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  OTP_TEST: 'otpTest',
  FEED: 'feed',
  USER_POSTS_PAGE: 'user/:id',
  USER: 'user',
  SETTINGS: 'settings',
  FRIEND_REQUESTS: 'friendRequests',
  ADD_POST: "addPosts",
  WILDCARD_ROUTE: '**',
};

export const API_ROUTES = {
  BASE_URL: 'http://localhost:3400',
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  ROOM_GET: '/prevChat',
  GET_CHAT: '/messages',
  SEARCH: '/user/search',
  MESSAGES: '/messages',
  SEND_OTP: '/otp',
  VERIFY_OTP: '/verifyOtp',
  FEED: '/feedForUser',
  CHECK_FRIENDS: '/friendsOrNot',
  PROFILE_DETAILS: '/user',
  USER_DETAILS: '/userDetails',
  LIKE_A_POST: '/likes',
  DISLIKE_A_POST: '/dislike',
  REMOVE_FRIEND: '/deleteFriend',
  SEARCH_USERS: '/searchUsers',
  FRIEND_REQUESTS: '/getFriendRequests',
  ACCEPT_FRIEND_REQUESTS: '/acceptRequest',
  SEND_REQUEST: "/sendRequest"
};
