import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiCallsService } from '../../../services/api-calls.service';
import { API_ROUTES, ROUTES_UI } from '../../../constants';

@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    RouterModule,
    JsonPipe,
    CommonModule,
  ],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css',
})
export class UpdatePostComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  userSelected: string = '';
  postSelected: string = '';
  searchedUsers: any;
  canUpdateThePost: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  searchTerm: string = '';
  filteredItems: any[] = [];
  items: any[] = [];
  selectedItem: any;
  tag: any[] = [];
  allComments: any[] = [];

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
    this.activatedRoute.params.subscribe((data) => {
      this.postSelected = data['postId'];
    });
    this.activatedRoute.queryParams.subscribe((data) => {
      this.userSelected = data['user'];
    });

    if (this.userSelected === sessionStorage.getItem('userId')) {
      this.canUpdateThePost = true;
    } else {
      this.form.controls['caption']?.disable();
      this.setComments();
    }

    // console.log(this.activatedRoute);
    this.getPost();
  }

  onSubmit() {}
  setComments() {
    this.apiCalls
      .getCommentsOfPost(this.postSelected, this.allComments.length)
      .subscribe({
        next: (data: any) => {
          data.forEach((element: any) => {
            this.allComments.push(element);
          });
        },
        error: (err) => {
          this.sweetAlert.error(err.error.message);
        },
      });
  }

  getPost() {
    this.apiCalls.getUserSinglePost(this.postSelected).subscribe({
      next: (data: any) => {
        console.log(data);
        this.form.controls['caption'].setValue(data[0].caption);
        this.imagePreview = API_ROUTES.BASE_URL + '/' + data[0].imageOrVideo;
        // this.items = data;
        this.selectedItem = data[0];
        this.tag = this.selectedItem.taggedPeople;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ file: file });
    }
  }
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
  }

  addTaggedPeople() {
    if (
      this.form.controls['searchText'].value === this.selectedItem.searchInput
    ) {
      this.tag.push(this.selectedItem.item);
      this.sweetAlert.success('User Added to Tagged List');
      console.log(this.tag);
    } else {
      this.sweetAlert.error('Add a Valid User !!');
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

  getComments() {
    this.setComments();
  }
}
