import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { ROUTES_UI } from '../../../constants';

@Component({
  selector: 'app-otp-test',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp-test.component.html',
  styleUrl: './otp-test.component.css',
})
export class OtpTestComponent {
  fb: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router: Router = inject(Router);

  otpForm: FormGroup = this.fb.group({
    otp: this.fb.array(
      new Array(6)
        .fill(null)
        .map(() =>
          this.fb.control('', [
            Validators.required,
            Validators.pattern('[0-9]'),
          ])
        )
    ),
  });

  get otpControls() {
    return (this.otpForm.get('otp') as FormArray).controls;
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp.join('');
      console.log('OTP Entered:', otp);
      const email = localStorage.getItem('email') ?? '';
      this.apiCalls.validateOtp(email, Number(otp)).subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('email', res.email);
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId);

          this.router.navigate([ROUTES_UI.FEED]);

          this.sweetAlert.success(res.message);
        },
        error: (err) => {
          console.log(err);
          this.sweetAlert.error(err);
        },
      });
    } else {
      this.sweetAlert.error('Invalid OTP');
      console.log('Invalid OTP');
    }
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (
      input.value &&
      /\d/.test(input.value) &&
      index < this.otpControls.length - 1
    ) {
      const nextInput = document.getElementById(
        `otp-input-${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
