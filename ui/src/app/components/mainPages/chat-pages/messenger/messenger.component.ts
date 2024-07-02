import { Component, OnInit, inject } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiCallsService } from '../../../../services/api-calls.service';
import { SocketEventsService } from '../../../../services/socket-events.service';
import { dataBySearch } from '../../../../interfaces/user.interface';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { NavbarComponent } from '../../../home/navbar/navbar.component';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [
    ChatComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    NavbarComponent,
    JsonPipe,
  ],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css',
})
export class MessengerComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sockets: SocketEventsService = inject(SocketEventsService);
  formBuilder: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  //  the data from search as well as the previous chatted users
  dataBySearch: any[] = [];
  allUsers: any;
  defaultData: dataBySearch[] = [];
  chatData: any;
  selectedId: string | undefined = '';
  userPicture: any;
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';
  isModalVisible = false;
  groupArray: string[] = [];
  idUser: string = '';
  groupsData: any[] = [];
  flag: boolean = false;

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    addUsers: [''],
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setUsers(true);

    this.sockets.subjectToUpdate.subscribe(() => {
      this.setUsers();
    });
    this.searchSubject
      .pipe(
        debounceTime(300), // 300ms debounce time
        distinctUntilChanged() // Only emit when the value changes
      )
      .subscribe((searchText) => {
        // this.apiCalls.searchUserInFriends(searchText).subscribe((data: any) => {
        //   console.log(data);

        //   this.dataBySearch = data;
        // });
        console.log(searchText);
      });
  }

  openModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  setUsers(option?: boolean) {
    this.apiCalls.getUserFriends().subscribe({
      next: (res: any) => {
        console.log(res);
        const userId: string = sessionStorage.getItem('userId') ?? '';

        this.dataBySearch = res.data.map((data: any) => {
          if (String(data.user._id) == userId) {
            return data.friend;
          } else {
            return data.user;
          }
        });

        if (option) {
          this.chatData = this.dataBySearch[0].name;
          this.selectedId = this.dataBySearch[0]._id;
          this.userPicture = this.dataBySearch[0].profilePicture;

          this.dataBySearch.forEach((data: any) => {
            this.sockets.joinRoom(data._id, userId);
          });
        }
      },
      error: (err: any) => {
        this.sweetAlert.error(err.error.message);
      },
    });
  }

  searchUser(event: any) {
    const searchText = event.target.value;
    if (searchText === '') {
      this.setUsers();
      return;
    }
    this.searchSubject.next(searchText);
  }

  findImage(profileImagePath: string | undefined, err?: string) {}

  getChat(id: string | undefined, name: string, userPicture: string) {
    this.chatData = name;
    this.userPicture = userPicture;
    this.selectedId = id;
  }

  createRoomName(senderId: string | undefined, receiverId: string | null) {
    console.log([senderId, receiverId].sort().join('-'));
    return [senderId, receiverId].sort().join('-');
  }

  async addToGroup() {}
  // Image error
  onImageError() {}

  selectedEmailForGc(id: string, email: string) {}

  createGroup() {}

  addUsersToGroup() {}

  setToDefault() {}
  getGroupChat() {}
}
