import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ROUTES_UI } from '../../../constants';
import { CommonModule, JsonPipe } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, NavbarComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  activatedRoutes: ActivatedRoute = inject(ActivatedRoute);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router: Router = inject(Router);

  userId: string = '';
  loggedInUser: string = '';
  userData: any = '';

  ngOnInit(): void {
    this.activatedRoutes.params.subscribe((data) => {
      this.userId = data['id'];
    });
    this.loggedInUser = localStorage.getItem('userId') ?? '';

    this.getProfileDetails();
  }

  getProfileDetails() {
    this.apiCalls.getProfileDetails(this.userId).subscribe({
      next: (data: any) => {
        this.userData = data.data[0];
        console.log(this.userData);
      },
      error: (err: any) => {
        console.log(err);
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
            console.log(data);
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
}
