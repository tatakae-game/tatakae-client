import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/room.model';
import { RoomsService } from 'src/app/rooms.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[] = [];

  constructor(private roomService: RoomsService,) { }

  ngOnInit(): void {
    this.roomService.getRooms().then(res => {
      this.rooms = res;
    });
  }
}
