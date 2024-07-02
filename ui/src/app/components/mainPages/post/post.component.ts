import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ModalComponent } from '../chat-pages/modal/modal.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule, ModalComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  @Input() post: any;

  router: Router = inject(Router);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  isModalVisible: boolean = false;
  sharesModal: boolean = false;

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
  }

  shareTo() {
    this.sharesModal = !this.sharesModal
  }
}
