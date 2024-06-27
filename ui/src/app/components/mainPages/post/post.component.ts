import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_UI } from '../../../constants';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  router: Router = inject(Router);
  @Input() post: any;

  navigateToUserPage(id: any) {
    this.router.navigate([ROUTES_UI.USER, id]);
  }
}
