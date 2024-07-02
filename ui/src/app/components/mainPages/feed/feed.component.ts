import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../chat-pages/modal/modal.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NavbarComponent,
    PostComponent,
    CommonModule,
    ReactiveFormsModule,
    SearchedUserComponent,
    RouterModule,
    ModalComponent
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  apiCalls: ApiCallsService = inject(ApiCallsService);

  fb: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  postsData: any[] = [];
  private searchSubject = new Subject<string>();
  showFeed: boolean = true;
  searchedText: string = '';
  body: any;
  isModalVisible: boolean = false

  ngOnInit(): void {
    this.getFeed(0);
    this.body = document.getElementById('body-content');
    // this.body.classList.add('test');


    this.searchSubject
      .pipe(debounceTime(450), distinctUntilChanged())
      .subscribe((searchText) => {
        this.searchedText = searchText;
        // Debouncing
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
    this.body.classList.remove('test');
  }
  getFeed(length: number) {
    this.apiCalls.getFeed(length).subscribe({
      next: (data: any) => {
        console.log(data);
        data.forEach((element: any) => {
          this.postsData.push(element);
        });
      },
      error: (err: any) => {
        console.log(err);

        this.sweetAlert.error(err.message);
      },
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

  onScroll() {
    const scrollContainer = this.scrollContainer.nativeElement;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;
    const scrollHeight = scrollContainer.scrollHeight;
    const tolerance = 1; // Small tolerance value

    if (scrollTop + clientHeight >= scrollHeight - tolerance) {
      this.getFeed(this.postsData?.length);
    }
  }
}
