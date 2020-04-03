import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/rooms.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Session } from '../../models/session.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  session: Session
  newRoomForm: FormGroup;
  public tickets: Room[] = [];

  constructor(private roomService: RoomsService, private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.session = this.authService.session();

    this.newRoomForm = this.formBuilder.group({
      subject: ['', Validators.required],
      // guest: ['', Validators.required],
    });

    this.roomService.getTickets().then(res => {
      this.tickets = res;
    });
  }

  onSubmit(data: any): void {
    console.log(data);
    this.roomService.createTicket(data.subject).then(r => {
      console.log(r);
    })
  }

}
