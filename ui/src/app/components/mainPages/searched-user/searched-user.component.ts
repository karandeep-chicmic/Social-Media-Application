import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { SocketEventsService } from '../../../services/socket-events.service';

@Component({
  selector: 'app-searched-user',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './searched-user.component.html',
  styleUrl: './searched-user.component.css',
})
export class SearchedUserComponent implements OnChanges, OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  sockets: SocketEventsService = inject(SocketEventsService);
  router: Router = inject(Router);

  @Input() searchedUser: string = '';
  usersData: any;
  userId: string = '';

  ngOnChanges(): void {
    this.getProfile();
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId') ?? '';
  }

  getProfile() {
    this.apiCalls.getUsersOnSearchInput(this.searchedUser).subscribe({
      next: (res: any) => {
        this.usersData = res.data;
      },
      error: (err) => {},
    });
  }

  sendRequest(id: string) {
    this.apiCalls.sendFriendRequest(id).subscribe({
      next: (res: any) => {
        this.sweetAlert.success('Friend Request Sent');
        this.usersData.forEach((element: any) => {
          if (String(element._id) === String(id)) {
            element.reqSent = true;
          }
        });

        // Emit the notification
        this.sockets.emitFriendReqNotification(id, this.userId, 1);
      },
      error: (err) => {
        this.sweetAlert.error('ERROR while Sending friend Request !!');
      },
    });
  }

  navigateToUserPage(id: any) {
    this.router.navigate([ROUTES_UI.USER, id]);
  }
}
