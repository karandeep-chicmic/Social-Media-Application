import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  userData: any;
  isChecked = false;

  ngOnInit(): void {
    this.apiCalls.userDetails().subscribe({
      next: (data: any) => {
        this.userData = data.data;
        console.log(this.userData);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
