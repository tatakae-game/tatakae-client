import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/rooms.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[] = [];
  newRoomForm: FormGroup;
  newTicketForm: FormGroup;
  isSupportPage: boolean;
  redirectToUrl: string;
  searchedUsers: User[] = [];
  session: Session;

  constructor(private roomService: RoomsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
    this.isSupportPage = this.router.url.includes('support');

    this.session = this.authService.session();

    this.newRoomForm = this.formBuilder.group({
      name: ['', Validators.required],
      guest: ['', Validators.required],
    });

    this.newTicketForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.isSupportPage ? this.getTickets() : this.getRooms();

    this.redirectToUrl = (this.isSupportPage) ? '/support/ticket' : '/chat/room';
  }

  get ticketName() { return this.newTicketForm.get('name') }
  get roomName() { return this.newRoomForm.get('name') }
  get roomGuest() { return this.newRoomForm.get('guest') }

  async getTickets() {
    this.rooms = await this.roomService.getTickets();
  }

  async getRooms() {
    this.rooms = await this.roomService.getRooms();
  }

  async onTicketSubmit(data: any) {
    const success = await this.roomService.createTicket(data.name);
    if (success) {
      this.getTickets();
    } else {
      this.notifierService.notify('error', 'An error occured while creating a new ticket.');
    }
  }

  async onRoomSubmit(data: any) {
    const guest = this.searchedUsers.find(user => user.username === data.guest)
    
    const response = await this.roomService.createRoom(data.name, guest.id);
    if (response.success) {
      this.notifierService.notify('success', 'Room successfuly created.');
      this.getRooms();
    } else {
      this.notifierService.notify('error', 'An error occured while creating a new chat room.');
    }
  }

  async onGuestUpdate(event: any) {
    if (event.keyCode !== 13 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
      if (event.target.value.length > 0) {
        const users = await this.usersService.searchUsers(event.target.value);
        this.searchedUsers = users.filter(user => user.username !== this.session.user.username);
      }
    }
  }
}
