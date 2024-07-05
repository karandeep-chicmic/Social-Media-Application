import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiCallsService } from '../../../services/api-calls.service';
import { Router } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { SocketEventsService } from '../../../services/socket-events.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  router: Router = inject(Router);
  socket: SocketEventsService = inject(SocketEventsService);

  searchedText: string = '';
  private searchSubject = new Subject<string>();
  imagePreview: string | ArrayBuffer | null = null;
  searchedUsers: any;
  items: any[] = [];
  filteredItems: any[] = [];
  tag: any[] = [];
  selectedItem: any;

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
    taggedPeople: [[]],
    searchText: [''],
  });

  ngOnInit(): void {
    this.apiCalls.getUserFriends().subscribe({
      next: (res: any) => {
        this.items = res.data;
        this.items = this.items.map((data) => {
          if (String(data.user._id) === sessionStorage.getItem('userId')) {
            return data.friend;
          } else {
            return data.user;
          }
        });
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Please fill all the fields Correctly');
      return;
    }

    const formData = new FormData();
    formData.append('caption', this.form.value?.caption);
    formData.append('file', this.form.value?.file);
    formData.append('taggedPeople', JSON.stringify(this.tag));

    console.log(this.tag);
    // return

    this.apiCalls.addPosts(formData).subscribe({
      next: (res: any) => {
        this.sweetAlert.success('Post Added Successfully');
        this.router.navigate([
          ROUTES_UI.USER,
          sessionStorage.getItem('userId') || '',
        ]);

        this.tag.forEach((data: any) => {
          this.socket.emitFriendReqNotification(
            data._id,
            sessionStorage.getItem('userId'),
            2
          );
        });
      },
      error: (err) => {
        console.log('ERROR is: ', err);
      },
    });
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

  // searchUser(event: any) {
  //   const searchText = event.target.value;
  //   this.searchSubject.next(searchText);
  // } //debouncing

  searchTerm: string = '';

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    const search = this.form.controls['searchText'].value.toLowerCase();

    this.filteredItems = this.items.filter((item) => {
      if (
        item.name.includes(search) ||
        item.email.includes(search) ||
        item.username.includes(search)
      ) {
        return item;
      }
    });

    if (this.searchTerm === '') {
      this.filteredItems = [];
    }
  }

  setUsernameToSearch(item: any) {
    this.form.controls['searchText'].setValue(item.username);

    this.selectedItem = {
      searchInput: this.form.controls['searchText'].value,
      item: item,
    };

    this.filteredItems = [];
  }

  addTaggedPeople() {
    if (
      this.form.controls['searchText'].value === this.selectedItem.searchInput
    ) {
      this.tag.push(this.selectedItem.item);
      this.sweetAlert.success('User Added to Tagged List');
    } else {
      this.sweetAlert.error('Add a Valid User !!');
    }
  }
}
