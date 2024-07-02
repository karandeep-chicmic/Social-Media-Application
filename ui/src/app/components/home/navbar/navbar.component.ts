import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommonFunctionsAndVarsService } from '../../../services/common-functions-and-vars.service';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_UI } from '../../../constants';

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
  router: Router = inject(Router);
  showNavbarMain: boolean = true;

  userId: string = '';
  ngOnInit(): void {
    this.commonFunctions.showNavbar.subscribe((data: boolean) => {
      this.showNavbarMain = data;
    });

    this.userId = sessionStorage.getItem('userId') ?? '';
  }

  logoutUser() {
    sessionStorage.clear();
    this.router.navigate([ROUTES_UI.LOGIN]);
  }
}
