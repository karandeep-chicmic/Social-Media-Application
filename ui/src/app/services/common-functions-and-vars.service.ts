import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsAndVarsService {
  showNavbar = new BehaviorSubject<boolean>(false);

  createRoomName(senderId: string | undefined, receiverId: string | null) {
    return [senderId, receiverId].sort().join('-');
  }

  constructor() {}
}
