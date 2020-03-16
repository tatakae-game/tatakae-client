import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms: Room[] = [];

  constructor() { }

  ngOnInit(): void {
    this.rooms.push({
      id: '1',
      status: 'open',
      author: 'a',
      name: 'A room for a room',
      messages: [],
      users: [],
      created: new Date(),
      is_ticket: false,
    })

    this.rooms.push({
      id: '2',
      status: 'open',
      author: 'b',
      name: 'The old dungeon crew',
      messages: [],
      users: [],
      created: new Date(),
      is_ticket: false,
    })

    this.rooms.push({
      id: '3',
      status: 'open',
      author: 'c',
      name: 'A special gang',
      messages: [],
      users: [],
      created: new Date(),
      is_ticket: false,
    })
  }
}
