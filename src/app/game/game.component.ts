import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/ws.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private wsService: WsService) { }

  ngOnInit(): void {
    const socket = this.wsService.connect()

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
