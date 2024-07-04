import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommonFunctionsAndVarsService } from '../../../services/common-functions-and-vars.service';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { SocketEventsService } from '../../../services/socket-events.service';
import { ApiCallsService } from '../../../services/api-calls.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  commonFunctions: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );
  apiCalls: ApiCallsService = inject(ApiCallsService);
  router: Router = inject(Router);
  showNavbarMain: boolean = true;
  sockets: SocketEventsService = inject(SocketEventsService);

  userId: string = '';
  ngOnInit(): void {
    this.commonFunctions.showNavbar.subscribe((data: boolean) => {
      this.showNavbarMain = data;
    });

    this.userId = sessionStorage.getItem('userId') ?? '';
  }

  logoutUser() {
    this.apiCalls
      .removeSocket(sessionStorage.getItem('socketId') ?? '')
      .subscribe({
        next: (data) => {},
        error: (err) => {
          console.log('ERROR is : ', err);
        },
      });
    sessionStorage.clear();
    this.sockets.disconnectUser();
    this.router.navigate([ROUTES_UI.LOGIN]);
  }
}
