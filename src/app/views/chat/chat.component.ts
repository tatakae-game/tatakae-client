import { Component, OnInit } from '@angular/core';

import { WsService } from 'src/app/ws.service';
import { AuthService } from 'src/app/auth.service';

import { Message } from 'src/app/models/message.model';
import { Session } from 'src/app/models/session.model';

import { faImages, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public session: Session;
  public messages: Message[] = [];

  imageIcon = faImages;
  sendIcon = faPlay;

  constructor(private wsService: WsService, private authService: AuthService) { }

  ngOnInit(): void {
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

    const socket = this.wsService.connect(true)

    console.log('Starting socket server...')
    socket.on('connect', () => {
      console.log('connected')

      socket.emit('matchmaking')
    });
    socket.on('matchmaking info', console.log);
    socket.on('disconnect', () => console.log('disconnected'));

    console.log(socket)
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
