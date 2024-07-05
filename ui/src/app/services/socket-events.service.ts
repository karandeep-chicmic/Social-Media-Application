import { Injectable, OnInit, inject, signal } from '@angular/core';
import { ApiCallsService } from './api-calls.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlertService } from './sweet-alert.service';
import { Socket, io } from 'socket.io-client';
import { API_ROUTES, SOCKET_EVENTS } from '../constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketEventsService {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  http: HttpClient = inject(HttpClient);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  private socket: Socket;
  messages: any[] = [];
  subjectToUpdate = new Subject();
  messagesSubject = new Subject();
  selectedUser = signal('');

  chatMessages: any[] = [];

  constructor() {
    const user = sessionStorage.getItem('userId');
    if (sessionStorage.getItem('token')) {
      this.connectUser();
      this.joinAllGroupsAndUsers(user);
    }
  }

  connectUser() {
    this.socket = io(`${API_ROUTES.BASE_URL}${API_ROUTES.CHAT}`, {
      auth: {
        token: sessionStorage.getItem('token') ?? '',
      },
    });

    // console.log(this.socket);

    this.socket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.log('connected');
      console.log(this.socket.id);

      this.apiCalls.addSocket(this.socket.id).subscribe({
        next: (res: any) => {
          sessionStorage.setItem('socketId', res.data._id);
        },
        error: (err) => {
          console.log('ERROR is: ', err);
        },
      });
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });

    this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log('received message', data);

      if (data.sendersId !== (sessionStorage.getItem('userId') ?? '')) {
        this.sweetAlert.success('message received :' + data.messageContent);
        this.messagesSubject.next({
          messageSent: data,
        });
      }
    });

    this.socket.on(SOCKET_EVENTS.RECEIVE_FRIEND_REQ, (data) => {
      if (data.accept === 1) {
        this.sweetAlert.success(`Request Received from ${data.username} !!`);
      } else if (data.accept === 2) {
        this.sweetAlert.success(
          `User ${data.username} tagged you in a post !!`
        );
      } else if (data.accept === 3) {
        this.sweetAlert.success(
          `${data.username} has accepted your friend request !!`
        );
      }

      console.log('from Notification', data);
    });
  }

  disconnectUser() {
    this.socket?.disconnect();
  }

  trigger(data: any) {
    this.subjectToUpdate.next(data);
  }

  sendMsg(sendersId: string, roomId: string, messageContent: string) {
    this.socket.emit(
      SOCKET_EVENTS.SEND_MESSAGE,
      sendersId,
      roomId,
      messageContent,
      (data: any) => {
        this.messagesSubject.next(data);
      }
    );
  }

  joinRoom(
    sendersId: string | null | undefined,
    receiversId: string | undefined | null
  ) {
    this.socket.emit(
      SOCKET_EVENTS.JOIN_ROOM,
      sendersId,
      receiversId,
      (data: any) => {}
    );
  }

  // join group on basis of room name
  joinGroupRoom(name: string, user: string) {
    this.socket.emit(SOCKET_EVENTS.GROUP_JOIN, user, name, (data: any) => {});
  }

  createGroup(usersArray: any[], name: string) {
    this.apiCalls.createGroup(name).subscribe({
      next: (res: any) => {

        usersArray.forEach((data) => {
          this.socket.emit(
            SOCKET_EVENTS.GROUP_JOIN,
            data._id,
            res.data._id,
            (data: any) => {
              console.log('from create group', data);
            }
          );
        });
        return res.data;
      },
      error: (err: any) => {
        console.log('ERROR is:', err);
        return err;
      },
    });
  }

  joinByGroupName(name: string) {
    this.socket.emit(SOCKET_EVENTS.JOIN_BY_ROOM_NAME, name);
  }

  joinAllGroupsAndUsers(userId: any) {
    this.socket.emit(SOCKET_EVENTS.JOIN_ROOMS_ALL, userId, () => {
      console.log('joined all rooms');
    });
  }

  // Notifications
  emitFriendReqNotification(friendId: string, userId: string, accept: number) {
    this.socket.emit(
      SOCKET_EVENTS.SEND_REQ_NOTIFICATION,
      friendId,
      userId,
      accept,
      (data: any) => {
        console.log(data);
      }
    );
  }
}
