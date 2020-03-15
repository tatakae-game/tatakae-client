import { Component, OnInit } from '@angular/core';

import { WsService } from 'src/app/ws.service';
import { AuthService } from 'src/app/auth.service';

import { Message } from 'src/app/models/message.model';
import { Session } from 'src/app/models/session.model';

import { faImages, faPlay } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private wsService: WsService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.session = this.authService.session();

    this.messages.push({
      id: '0',
      author: '87afbc09bbf6c721a92c0ffb',
      type: 'text',
      data: "Welcome to Tatakae's chat",
      date: new Date(),
    })

    this.messages.push({
      id: '1',
      author: this.session.user.id,
      type: 'text',
      data: "Oh! That's beautiful!",
      date: new Date(),
    })

    this.socket = this.wsService.connect(`/chat`, {
      room: id,
    });

    this.socket.on('disconnect', () => console.log('disconnected'));
  }

  onSubmit() {
    if (this.socket.connected) {
      this.socket.emit('message', {
        type: 'text',
        data: 'Hello my friend!',
      });
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
