import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiCallsService } from '../../../../services/api-calls.service';
import { SocketEventsService } from '../../../../services/socket-events.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);

  @Input() chatData: any;
  @Input() selectedId: any;
  @Input() userPicture: any;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

  // All the chat messages associated with the selected user
  chatMessages: any;
  pageNumber: number = 0;
  fileToUpload: any;
  userLoggedIn: string | null = '';

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: [''],
    fileInput: [''],
  });

  previousMessages: any;
  messagesSubscription: Subscription | undefined;

  ngOnInit(): void {
    // this.chatMessages =
  }

  ngOnChanges(): void {
    this.loadPreviousMessages();
    console.log(this.selectedId, this.chatData, this.userPicture);
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  loadPreviousMessages() {}

  sendMsg() {}

  scrollToBottom() {}

  loadMoreMsgs() {}

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg();
    }
  }

  fileUpload(event: any) {}
}
