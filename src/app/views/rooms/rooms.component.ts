import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/rooms.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/auth.service';

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

  async getTickets() {
    this.rooms = await this.roomService.getTickets();
  }

  async getRooms() {
    this.rooms = await this.roomService.getRooms();
  }

  onTicketSubmit(data: any): void {
    this.roomService.createTicket(data.name).then(response => {
      if (response) {
        this.getTickets();
      }
    });
  }

  onRoomSubmit(data: any): void {
    console.log(data);
    this.roomService.createRoom(data.name, data.guest).then(response => {
      if (response) {
        this.getRooms();
      }
    });
  }

  async onInviteUserUpdate(value: string) {
    if (value.length > 0) {
      const users = await this.usersService.searchUsers(value);
      this.searchedUsers = users.filter(user => user.username !== this.session.user.username);
    }
  }
}
