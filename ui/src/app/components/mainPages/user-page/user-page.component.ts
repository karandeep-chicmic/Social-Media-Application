import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ROUTES_UI } from '../../../constants';
import { CommonModule, JsonPipe } from '@angular/common';
import { NavbarComponent } from '../../home/navbar/navbar.component';

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
  userData: any = ""


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
        this.userData = data.data[0]
        console.log(this.userData);
        
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
