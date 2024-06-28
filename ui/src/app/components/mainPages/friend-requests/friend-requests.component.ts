import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';

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
  friendRequests: any;

  ngOnInit(): void {
    this.apiCalls.getFriendRequests().subscribe({
      next: (data: any) => {
        console.log(data);
        this.friendRequests = data.data;
      },
      error: (err) => {
        this.sweetAlert.error('No Friend requests were Found for you !!');
      },
    });
  }

  acceptRequest(id: string) {
    this.apiCalls.acceptFriendRequest(id).subscribe({
      next: (data) => {
        console.log(data);

        this.friendRequests = this.friendRequests.filter((data: any) => {
          return String(data._id) !== String(id);
        });
        this.sweetAlert.success('Friend Request accepted !!');
      },
      error: (err) => {
        console.log(err);

        this.sweetAlert.error('Error while accepting Friend request !!');
      },
    });
  }
}
