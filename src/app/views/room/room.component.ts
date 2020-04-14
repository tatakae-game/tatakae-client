import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { WsService } from 'src/app/ws.service';
import { AuthService } from 'src/app/auth.service';

import { Message } from 'src/app/models/message.model';
import { Session } from 'src/app/models/session.model';

import { faImages, faPlay, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RoomsService } from 'src/app/rooms.service';
import { UsersService } from 'src/app/services/users.service';

import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild('chat') public chatContainer: ElementRef;

  public session: Session;
  public socket: SocketIOClient.Socket;

  public messages: Message[] = [];

  imageIcon = faImages;
  sendIcon = faPlay;
  inviteIcon = faUserPlus;

  messageForm: FormGroup;
  inviteForm: FormGroup;

  room: Room;
  users: User[] = [];

  searchedUsers: User[] = [];

  isSupportPage: boolean;

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private notifierService: NotifierService,
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });

    this.inviteForm = this.formBuilder.group({
      user: ['', Validators.required],
    });
  }

  async ngOnInit() {

    this.isSupportPage = this.router.url.includes('support');

    this.session = this.authService.session();
    const id = this.route.snapshot.paramMap.get('id');

    this.socket = this.wsService.connect(`/chat`, {
      room: id,
    });

    await this.getRoom();

    const messages = this.room.messages.map(message => ({
      ...message,
      date: new Date(message.date),
    }));

    this.messages.push(...messages);

    await this.getUsersInRoom();

    this.socket.on('new message', (data: Message) => {
      data.date = new Date(data.date);
      this.messages.push(data);

      this.scrollToBottom()
    });

    this.socket.on('disconnect', () => console.log('disconnected'));
  }

  ngAfterViewInit() { }

  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  onMessageSubmit(data: any): void {
    if (this.socket.connected) {
      this.socket.emit('message', {
        type: 'text',
        data: data.message,
        author: this.session.user.id,
      });
      this.messageForm.patchValue({
        message: '',
      })
    }
  }

  async onInviteSubmit(data: any) {
    try {
      const guest = this.searchedUsers.find(user => user.username === data.user);

      const res = await this.roomsService.addUser(this.room.id, guest.id);

      if (res.success) {
        await this.getRoom();
        await this.getUsersInRoom();
      }
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  async onInviteUserUpdate(event) {
    try {
      if (event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
        if (event.target?.value.length > 0) {
          const users = await this.usersService.searchUsers(event.target.value);
          this.searchedUsers = users.filter(user => !this.room.users.includes(user.id));
        }
      }
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  sanitizeDate(date: Date): string {
    const hours = `${date.getHours().toString().padStart(2, '0')}`;
    const minutes = `${date.getMinutes().toString().padStart(2, '0')}`;

    const time = `${hours}:${minutes}`;

    {
      const day = `${date.getDate().toString().padStart(2, '0')}`;
      const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const year = `${date.getFullYear().toString().padStart(2, '0')}`;

      return `${day}/${month}/${year} at ${time}`
    }
  }

  getUsername(id: string) {
    return this.users.find(user => user.id === id)?.username
  }

  async closeTicket() {
    try {
      const res = await this.roomsService.closeTicket(this.room.id);
      if (res?.success) {
        await this.router.navigateByUrl('/support');
        this.notifierService.notify('success', `Ticket ${this.room.name} closed successfuly.`);
      }
    } catch (error) {
      this.notifierService.notify('error', error.message);
    }
  }

  async getUsersInRoom() {
    try {
      this.users = await Promise.all(this.room.users.map(id => this.usersService.getUser(id)));
    } catch (error) {
      this.notifierService.notify('error', `An error occured while closing the ticket.`);
    }
  }

  async getRoom() {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      this.room = await this.roomsService.getRoom(id);
    } catch (error) {
      this.notifierService.notify('error', `An error occured while closing the ticket.`);
    }
  }
}
