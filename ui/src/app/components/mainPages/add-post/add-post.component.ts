import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiCallsService } from '../../../services/api-calls.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  apiCalls: ApiCallsService = inject(ApiCallsService);

  searchedText: string = '';
  private searchSubject = new Subject<string>();
  imagePreview: string | ArrayBuffer | null = null;
  searchedUsers: any;
  form: FormGroup = this.fb.group({
    caption: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
    file: ['', [Validators.required]],
    taggedPeople: this.fb.array([]),
  });

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(450), distinctUntilChanged())
      .subscribe((searchText) => {
        this.searchedText = searchText;
        console.log(this.searchedText);
        // this.apiCalls
      });
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.sweetAlert.error('Please fill all the fields Correctly');
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ file: file });
    }
  }

  searchUser(event: any) {
    const searchText = event.target.value;
    this.searchSubject.next(searchText);
  }
}
