export const ROUTES_UI = {
  DEFAULT: '',
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  OTP_TEST: "otpTest",
  FEED: "feed",
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
  SEND_OTP: "/otp",
  VERIFY_OTP:"/verifyOtp"
};
