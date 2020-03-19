import { Component, OnInit } from '@angular/core';

import { WsService } from 'src/app/ws.service';
import { AuthService } from 'src/app/auth.service';

import { Message } from 'src/app/models/message.model';
import { Session } from 'src/app/models/session.model';

import { faImages, faPlay } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomsService } from 'src/app/rooms.service';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  public session: Session;
  public socket: SocketIOClient.Socket;

  public messages: Message[] = [];

  imageIcon = faImages;
  sendIcon = faPlay;

  messageForm: FormGroup;

  room: Room;
  usersInRoom: User[];

  constructor(
    private wsService: WsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private roomService: RoomsService,
  ) {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.session = this.authService.session();
    const id = this.route.snapshot.paramMap.get('id');

    this.socket = this.wsService.connect(`/chat`, {
      room: id,
    });

    this.room = await this.roomService.getRoom(id);
    this.messages.push(...this.room.messages);

    const users = await Promise.all(this.room.users.map(id => this.roomService.getUser(id)));

    this.socket.on('new message', (data: Message) => {
      data.date = new Date(data.date);
      data.author = this.session.user.username;
      this.messages.push(data);
    })

    this.socket.on('disconnect', () => console.log('disconnected'));
  }

  onSubmit(data: any): void {
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
}
