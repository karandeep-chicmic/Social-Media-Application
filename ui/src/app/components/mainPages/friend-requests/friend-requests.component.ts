import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { SocketEventsService } from '../../../services/socket-events.service';

@Component({
  selector: 'app-friend-requests',
  standalone: true,
  imports: [NavbarComponent, JsonPipe, CommonModule],
  templateUrl: './friend-requests.component.html',
  styleUrl: './friend-requests.component.css',
})
export class FriendRequestsComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  sockets: SocketEventsService = inject(SocketEventsService);
  friendRequests: any;

  ngOnInit(): void {
    this.apiCalls.getFriendRequests().subscribe({
      next: (data: any) => {
        this.friendRequests = data.data;
      },
      error: (err) => {
        this.sweetAlert.error('No Friend requests were Found for you !!');
      },
    });
  }

  acceptRequest(id: string) {
    this.apiCalls.acceptFriendRequest(id).subscribe({
      next: (data: any) => {
        this.friendRequests = this.friendRequests.filter((data: any) => {
          return String(data._id) !== String(id);
        });
        this.sweetAlert.success('Friend Request accepted !!');
        console.log(id);

        // this.sockets.joinRoom(id, sessionStorage.getItem('userId'));

        // this.sockets.emitFriendReqNotification(
        //   sessionStorage.getItem('userId'),
        //   id,
        //   3
        // );
      },
      error: (err) => {
        console.log('ERROR is: ', err);

        this.sweetAlert.error('Error while accepting Friend request !!');
      },
    });
  }
}
