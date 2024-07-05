import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ROUTES_UI } from '../../../constants';
import { CommonModule, JsonPipe } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import Swal from 'sweetalert2';
import { SocketEventsService } from '../../../services/socket-events.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, NavbarComponent, RouterModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  activatedRoutes: ActivatedRoute = inject(ActivatedRoute);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  sockets: SocketEventsService = inject(SocketEventsService);
  router: Router = inject(Router);

  userId: string = '';
  loggedInUser: string = '';
  userData: any = '';
  privatePage: boolean = false;
  totalFriends: number = 0;

  ngOnInit(): void {
    this.activatedRoutes.params.subscribe((data) => {
      this.userId = data['id'];
    });
    this.loggedInUser = sessionStorage.getItem('userId') ?? '';

    this.getProfileDetails();

    this.apiCalls.getFriendsLength(this.userId).subscribe({
      next: (data: any) => {
        this.totalFriends = data.data.length;
      },
      error: (err) => {
        console.log('ERROR is:', err);
      },
    });
  }

  getProfileDetails() {
    this.apiCalls.getProfileDetails(this.userId).subscribe({
      next: (data: any) => {
        this.userData = data.data[0];
      },
      error: (err: any) => {
        this.privatePage = true;
        this.userData = err?.error?.data?.[0];
        console.log('ERROR is:', err.error.data);
      },
    });
  }

  addPost() {
    this.router.navigate([ROUTES_UI.ADD_POST], {
      queryParams: { userId: this.userId },
    });
  }

  removeFriend() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to unfriend ${this.userData.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiCalls.removeFriends(this.userData._id).subscribe({
          next: (data: any) => {
            this.sweetAlert.success('Friend Removed Successfully');
            this.router.navigate([ROUTES_UI.FEED]);
          },
          error: (err: any) => {
            this.sweetAlert.error(err.message);
          },
        });
      }
    });
  }

  addFriend() {
    this.apiCalls.sendFriendRequest(this.userData._id).subscribe({
      next: (data: any) => {
        this.sweetAlert.success('Friend Request Sent Successfully');

        this.sockets.emitFriendReqNotification(
          this.userData._id,
          this.userId,
          1
        );
        this.router.navigate([ROUTES_UI.FEED]);
      },
      error: (err: any) => {
        this.sweetAlert.error('Cant send Friend Request !!');
      },
    });
  }
}
