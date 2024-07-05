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
import { CommonFunctionsAndVarsService } from '../../../../services/common-functions-and-vars.service';

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
  commonFunc: CommonFunctionsAndVarsService = inject(
    CommonFunctionsAndVarsService
  );

  //  the data from search as well as the previous chatted users
  dataBySearch: any[] = [];
  allUsers: any;

  chatData: any;
  selectedId: string | undefined = '';
  userPicture: any;

  username: string | null = 'temp';
  isModalVisible = false;
  groupArray: any[] = [];
  groupsBool: boolean = false;

  idUser: string = '';
  groupsData: any[] = [];
  usersToAddToGroup: any[] = [];

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setUsers(true);

    this.sockets.joinAllGroupsAndUsers(sessionStorage.getItem('userId'));

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

        //   this.dataBySearch = data;
        // });
        console.log(searchText);
      });
  }

  openModal() {
    this.isModalVisible = !this.isModalVisible;
    this.usersToAddToGroup = [];
    this.usersToAddToGroup.push({ _id: sessionStorage.getItem('userId') });
  }

  setUsers(option?: boolean) {
    this.apiCalls.getUserFriends().subscribe({
      next: (res: any) => {
        const userId: string = sessionStorage.getItem('userId') ?? '';

        this.dataBySearch = res.data.map((data: any) => {
          if (String(data.user._id) == userId) {
            return data.friend;
          } else {
            return data.user;
          }
        });

        this.allUsers = this.dataBySearch;

        if (option) {
          this.chatData = this.dataBySearch[0].name;
          this.selectedId = this.dataBySearch[0]._id;
          this.userPicture = this.dataBySearch[0].profilePicture;

          this.dataBySearch.forEach((data: any) => {
            const roomName: string = this.commonFunc.createRoomName(
              data._id,
              userId
            );

            this.sockets.joinGroupRoom(roomName, data._id);
            this.sockets.joinGroupRoom(roomName, userId);
          });
        }
      },
      error: (err: any) => {
        this.sweetAlert.error("Can't get User Friends !!");
      },
    });
  }

  addToGroupArray(item) {
    const user = this.usersToAddToGroup.find((data) => {
      if (data._id === item._id) {
        this.sweetAlert.error('User already added');
        return true;
      }
      return false;
    });

    if (!user) {
      this.usersToAddToGroup.push({ username: item.username, _id: item._id });
    }
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

  getChat(id?: string | undefined, name?: string, userPicture?: string) {
    this.chatData = name;
    this.userPicture = userPicture;
    this.selectedId = id;
  }

  createRoomName(senderId: string | undefined, receiverId: string | null) {
    return [senderId, receiverId].sort().join('-');
  }

  showGroups() {
    this.groupsBool = !this.groupsBool;
    if (this.groupsBool === true) {
      this.apiCalls.getUserGroups().subscribe({
        next: (data: any) => {
          this.groupArray = data;
          this.selectedId = data[0].roomName;
          this.chatData = data[0].groupName;
        },
      });
    } else {
      this.groupArray = [];
      this.selectedId = this.dataBySearch[0]._id;
      this.chatData = this.dataBySearch[0].username;
    }
    // this.sockets.getGroupRooms().subscribe((data: any) => {})
  }

  // Image error
  onImageError() {}

  selectedEmailForGc(id: string, email: string) {}

  createGroup() {
    if (this.form.invalid || this.usersToAddToGroup.length === 0) {
      this.sweetAlert.error('Group name and users are required !!');
    }

    const res: any = this.sockets.createGroup(
      this.usersToAddToGroup,
      this.form.value.name
    );

    console.log('create group', res?.roomId);

    this.sockets.joinGroupRoom(
      res?.roomId,
      sessionStorage.getItem('userId') ?? ''
    );
    this.isModalVisible = !this.isModalVisible;
  }

  addUsersToGroup() {}

  setToDefault() {}
  getGroupChat() {}
}
