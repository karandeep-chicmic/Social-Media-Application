import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { ROUTES_UI } from '../../../constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  router: Router = inject(Router);

  selectedImage: any;
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(15)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(15)],
    ],
  });
  photoUpload(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Please fill all the fields correctly');
      return;
    }

    if (!this.selectedImage) {
      this.sweetAlert.error('Please upload image before registering the user');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('password', this.form.get('password')?.value);
    formData.append('username', this.form.get('username')?.value);
    formData.append('file', this.selectedImage);

    this.apiCalls.registerUser(formData).subscribe({
      next: (data: any) => {
        localStorage.setItem('email', data.userDetails.email);
        this.router.navigate([ROUTES_UI.OTP_TEST]);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 421) {
          localStorage.setItem('email', err.error.email);

          this.router.navigate([ROUTES_UI.OTP_TEST]);
        }

        this.sweetAlert.error(err.error);
      },
    });
  }
}
