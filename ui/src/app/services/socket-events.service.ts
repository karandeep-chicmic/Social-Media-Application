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
    this.socket = io(`${API_ROUTES.BASE_URL}${API_ROUTES.CHAT}`);
    this.socket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.log('connected');
    });

    this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log('received message', data);
      console.log('selectedId', this.selectedUser());

      if (data.sendersId !== this.selectedUser()) {
        this.sweetAlert.success('message received :' + data.messageContent);
        this.messagesSubject.next({
          messageSent: data,
        });
      }
    });
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
        console.log('from send', data);
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
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  joinByGroupName(name: string) {
    this.socket.emit(SOCKET_EVENTS.JOIN_BY_ROOM_NAME, name);
  }
}
