import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/ws.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private wsService: WsService) { }

  ngOnInit(): void {
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

}
