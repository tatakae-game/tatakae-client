import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/ws.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(private wsService :WsService) { }

  ngOnInit(): void {
    const socket = this.wsService.connect('/matchmaking')
    socket.on('match found', (data) => {
      console.log(data)
    })
  }

}
