import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ModalComponent } from '../chat-pages/modal/modal.component';
import { CommonFunctionsAndVarsService } from '../../../services/common-functions-and-vars.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { noWhitespaceValidator } from '../../../validators/no-white-space-validator';
import { noStartingWhiteSpace } from '../../../validators/starting-whitespace-validator';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  @Input() post: any;

  router: Router = inject(Router);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  commonFuncs: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );
  fb: FormBuilder = inject(FormBuilder);

  isModalVisible: boolean = false;
  sharesModal: boolean = false;
  allComments: any[] = [];

  form: FormGroup = this.fb.group({
    comment: ['', [Validators.required, noStartingWhiteSpace()]],
  });

  ngOnInit(): void {
    this.commonFuncs.showModal.subscribe((data) => {
      this.isModalVisible = data;
      this.sharesModal = data;
    });
  }

  getComments() {
    this.apiCalls
      .getCommentsOfPost(this.post._id, this.allComments.length)
      .subscribe({
        next: (data: any) => {
          data.forEach((element: any) => {
            this.allComments.push(element);
          });
        },
        error: (err) => {
          this.sweetAlert.error('No more Comments');
        },
      });
  }

  navigateToUserPage(id: any) {
    this.router.navigate([ROUTES_UI.USER, id]);
  }

  likeOrUnlike(flag: boolean) {
    if (flag === true) {
      this.apiCalls.dislikeAPost(this.post?._id).subscribe({
        next: (data) => {
          this.post.liked = !this.post?.liked;
          this.post.likes--;
        },
        error: (err) => {
          this.sweetAlert.error(err.data);
        },
      });
    } else {
      this.apiCalls.likeAPost(this.post?._id).subscribe({
        next: (data) => {
          this.post.liked = !this.post?.liked;
          this.post.likes++;
        },
        error: (err) => {
          this.sweetAlert.error(err.data);
        },
      });
    }
  }
  openComments() {
    this.isModalVisible = !this.isModalVisible;
    this.getComments();
  }

  shareTo() {
    this.sharesModal = !this.sharesModal;
  }
  comment() {
    if (this.form.invalid) {
      this.sweetAlert.error('Comment Field is Invalid !!');
      return;
    }

    this.apiCalls
      .addAComment(this.form.value.comment, this.post._id)
      .subscribe({
        next: (data: any) => {
          this.allComments.push(data.data);
          // this.post.comments.push(data.data);

          this.form.reset();
        },
        error: (err) => {
          this.sweetAlert.error(err.data);
        },
      });
  }

  navigateToPostPage() {
    this.router.navigate([ROUTES_UI.UPDATE_POST_1, this.post._id], {
      queryParams: { user: this.post.userUploaded },
    });
  }
}
