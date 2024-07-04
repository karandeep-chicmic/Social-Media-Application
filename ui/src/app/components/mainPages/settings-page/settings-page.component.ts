import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  fb: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  updatePasswordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  userData: any;
  isChecked = false;

  //  Initializing the userDetails from Api
  ngOnInit(): void {
    this.apiCalls.userDetails().subscribe({
      next: (data: any) => {
        this.userData = data.data;
      },
      error: (err: any) => {
        console.log('ERROR is:', err);
      },
    });
  }
  onToggle() {
    this.apiCalls.updateThePrivacy().subscribe({
      next: (data: any) => {
        this.userData.privacy = !this.userData.privacy;
      },
      error: (err: any) => {
        console.log('ERROR is:', err);
      },
    });
  }

  // updating the password
  updatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.sweetAlert.error('Please fill the form details correctly !!');
      return;
    }

    if (
      this.updatePasswordForm.value.newPassword !==
      this.updatePasswordForm.value.confirmPassword
    ) {
      this.sweetAlert.error('Password does not match !!');
      return;
    }

    this.apiCalls
      .updatePassword(
        this.updatePasswordForm.value.oldPassword,
        this.updatePasswordForm.value.newPassword
      )
      .subscribe({
        next: (data: any) => {
          this.sweetAlert.success('Password Updated Successfully !!');
          this.updatePasswordForm.reset();
        },
        error: (err: any) => {
          console.log('ERROR is:', err);
          this.sweetAlert.error(err.error.message);
        },
      });
  }
}
