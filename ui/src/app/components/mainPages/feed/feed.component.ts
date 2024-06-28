import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchedUserComponent } from '../searched-user/searched-user.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NavbarComponent,
    PostComponent,
    CommonModule,
    ReactiveFormsModule,
    SearchedUserComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  fb: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  postsData: any;
  private searchSubject = new Subject<string>();
  showFeed: boolean = true;
  searchedText: string = '';

  ngOnInit(): void {
    this.apiCalls.getFeed().subscribe({
      next: (data: any) => {
        console.log(data);
        this.postsData = data;
      },
      error: (err: any) => {
        console.log(err);

        this.sweetAlert.error(err.message);
      },
    });

    this.searchSubject
      .pipe(debounceTime(450), distinctUntilChanged())
      .subscribe((searchText) => {
        this.searchedText = searchText;
        // Debouncing
      });
  }
  searchUser(event: any) {
    this.showFeed = false;
    const searchText = event.target.value;
    if (searchText === '') {
      this.showFeed = true;
      return;
    }
    this.searchSubject.next(searchText);
  }
  searchFormSubmit() {}
}
