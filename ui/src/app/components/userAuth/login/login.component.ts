import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { user } from '../../../interfaces/user.interface';
import { ApiCallsService } from '../../../services/api-calls.service';
import { Router, RouterModule } from '@angular/router';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ROUTES_UI } from '../../../constants';
import { CommonFunctionsAndVarsService } from '../../../services/common-functions-and-vars.service';
import { SocketEventsService } from '../../../services/socket-events.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { noWhitespaceValidator } from '../../../validators/no-white-space-validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //  all services
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  sockets: SocketEventsService = inject(SocketEventsService);
  commonFunctions: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );
  router: Router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        noWhitespaceValidator(),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        noWhitespaceValidator(),
      ],
    ],
  });

  // on submit of login form
  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid !!');
      return;
    }

    const userToLogin: user = {
      username: this.form.controls['username'].value,
      password: this.form.controls['password'].value,
    };

    this.apiCalls.loginUser(userToLogin).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userId', data.userId);

        this.sockets.connectUser();
        this.sockets.selectedUser.set(`${data.userId}`);
        this.commonFunctions.showNavbar.next(true);

        this.router.navigate([ROUTES_UI.FEED]);
      },
      error: (err) => {
        if (err.status === 421) {
          sessionStorage.setItem('email', err.error.email);

          this.apiCalls.sendOtp(err.error.email).subscribe({
            next: (data) => {
              this.sweetAlert.success('Otp sent successfully');
              this.router.navigate([ROUTES_UI.OTP_TEST]);
            },
            error: (err) => {
              console.log('ERROR IS:', err);
              this.sweetAlert.error('Error sending OTP !!');
            },
          });
        }
        console.log('ERROR IS :', err);
        this.sweetAlert.error('First Verify your account !!');
      },
    });
  }
}
