import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../constants';
import { user } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  http = inject(HttpClient);

  constructor() {}

  loginUser(userData: user) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.LOGIN, userData);
  }

  registerUser(userData: FormData) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.REGISTER, userData);
  }

  sendOtp(email: string) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.SEND_OTP, {
      email: email,
    });
  }
  getFeed() {
    return this.http.get(API_ROUTES.BASE_URL + API_ROUTES.FEED);
  }

  validateOtp(email: string, otp: number) {
    return this.http.post(API_ROUTES.BASE_URL + API_ROUTES.VERIFY_OTP, {
      email: email,
      otp: otp,
    });
  }

  checkForFriends(id: string) {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.CHECK_FRIENDS}/${id}`
    );
  }
  getProfileDetails(id: string) {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.PROFILE_DETAILS}/${id}`
    );
  }
  userDetails() {
    return this.http.get(`${API_ROUTES.BASE_URL}${API_ROUTES.USER_DETAILS}`);
  }

  likeAPost(id: string) {
    return this.http.post(`${API_ROUTES.BASE_URL}${API_ROUTES.LIKE_A_POST}`, {
      postId: id,
    });
  }
  dislikeAPost(id: string) {
    return this.http.delete(
      `${API_ROUTES.BASE_URL}${API_ROUTES.DISLIKE_A_POST}/${id}`
    );
  }
  removeFriends(id: string) {
    return this.http.delete(
      `${API_ROUTES.BASE_URL}${API_ROUTES.REMOVE_FRIEND}/${id}`
    );
  }
  getUsersOnSearchInput(searchedInput: string) {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.SEARCH_USERS}/${searchedInput}`
    );
  }

  getFriendRequests() {
    return this.http.get(`${API_ROUTES.BASE_URL}${API_ROUTES.FRIEND_REQUESTS}`);
  }

  acceptFriendRequest(id: string) {
    return this.http.put(
      `${API_ROUTES.BASE_URL}${API_ROUTES.ACCEPT_FRIEND_REQUESTS}?id=${id}`,
      {}
    );
  }

  sendFriendRequest(friendId: string) {
    return this.http.post(`${API_ROUTES.BASE_URL}${API_ROUTES.SEND_REQUEST}`, {
      friendReqUserId: friendId,
    });
  }
  getUserFriends() {
    return this.http.get(
      `${API_ROUTES.BASE_URL}${API_ROUTES.GET_USER_FRIENDS}`
    );
  }

  addPosts(formDataPost: FormData) {
    console.log(formDataPost);

    return this.http.post(
      `${API_ROUTES.BASE_URL}${API_ROUTES.ADD_POSTS}`,
      formDataPost
    );
  }
  updateThePrivacy() {
    return this.http.put(`${API_ROUTES.BASE_URL}${API_ROUTES.PRIVACY}`, {});
  }
  updatePassword(oldPass: string, newPass: string) {
    return this.http.put(
      `${API_ROUTES.BASE_URL}${API_ROUTES.UPDATE_PASSWORD}`,
      { oldPassword: oldPass, newPassword: newPass }
    );
  }
}
