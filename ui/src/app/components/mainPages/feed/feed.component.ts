import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../home/navbar/navbar.component';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NavbarComponent, PostComponent, CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  postsData: any;

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
  }
}
