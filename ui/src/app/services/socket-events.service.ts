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
  selectedUser = signal('');
  messages: any[] = [];
  subjectToUpdate = new Subject();
  

  constructor() {
    this.socket = io(`${API_ROUTES.BASE_URL}${API_ROUTES.CHAT}`);
    this.socket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.log('connected');
    });

    this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log('received message', data);
    });
  }

  sendMsg(sendersId: string, roomId: string, messageContent: string) {
    this.socket.emit(
      SOCKET_EVENTS.SEND_MESSAGE,
      sendersId,
      roomId,
      messageContent,
      (data: any) => {
        console.log('send message', data);
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

  joinGroupRoom(name: string, users: any[]) {
    users.forEach((id) => {
      this.socket.emit(SOCKET_EVENTS.GROUP_JOIN, id, name, (data: any) => {});
    });
  }

  joinByGroupName(name: string) {
    this.socket.emit(SOCKET_EVENTS.JOIN_BY_ROOM_NAME, name);
  }
}
