import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiCallsService } from '../../../../services/api-calls.service';
import { SocketEventsService } from '../../../../services/socket-events.service';
import { CommonFunctionsAndVarsService } from '../../../../services/common-functions-and-vars.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);
  commonFunctions: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  @Input() chatData: any;
  @Input() selectedId: any;
  @Input() userPicture: any;
  @Input() groupOrNot: boolean;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

  // All the chat messages associated with the selected user
  chatMessages: any[] = [];
  pageNumber: number = 0;
  fileToUpload: any;
  userLoggedIn: string | null = '';
  roomName: string = '';

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: ['', [Validators.required]],
    fileInput: [''],
  });

  previousMessages: any;
  messagesSubscription: Subscription | undefined;

  ngOnInit(): void {
    // this.chatMessages =
    this.userLoggedIn = sessionStorage.getItem('userId');
    this.sockets.selectedUser.set(this.userLoggedIn);

    this.sockets.messagesSubject.subscribe((data: any) => {
      if (data.messageSent.roomId === this.roomName) {
        this.chatMessages.push(data.messageSent);
      }
    });
  }

  ngOnChanges(): void {
    this.chatMessages = [];
   

    if (this.userLoggedIn && this.selectedId && !this.groupOrNot) {
      this.loadPreviousMessages(0);
      this.roomName = this.commonFunctions.createRoomName(
        this.userLoggedIn,
        this.selectedId
      );
    } else if (this.userLoggedIn && this.selectedId && this.groupOrNot) {
      this.loadPreviousMessages(0);
      this.roomName = this.selectedId;
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {}

  loadPreviousMessages(length: number) {
    this.sockets.messages = [];
    let chatRoom: string = '';

    if (this.groupOrNot) {
      chatRoom = this.selectedId;
    } else {
      chatRoom = this.commonFunctions.createRoomName(
        this.selectedId,
        this.userLoggedIn
      );
    }

    this.apiCalls.getChat(chatRoom, length).subscribe({
      next: (data: any) => {
        for (let i = data.data.length - 1; i >= 0; i--) {
          const element = data.data[i];
          this.chatMessages.unshift(element);
        }
      },
      error: (err) => {
        // this.chatMessages = [];
        // this.sweetAlert.error('No more Messages !!');
        console.log('ERROR  is : ', err);
      },
    });
  }

  sendMsg() {
    if (this.form.invalid) {
      this.sweetAlert.error('Cant sent empty chat !!');
      return;
    }

    const msg = this.sockets.sendMsg(
      this.userLoggedIn,
      this.roomName,
      this.form.value.inputChatMsg
    );

    this.form.reset();
  }

  scrollToBottom(): void {
    try {
      this.chatHistoryContainer.nativeElement.scrollTop =
        this.chatHistoryContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom', err);
    }
  }

  loadMoreMsgs() {
    if (this.chatHistoryContainer.nativeElement.scrollTop === 0) {
      this.loadPreviousMessages(this.chatMessages.length);
    }
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg();
    }
  }

  fileUpload(event: any) {}
}
