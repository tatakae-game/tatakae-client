import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/ws.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
  };

  code = 'function x() {\nconsole.log("Hello world!");\n}';

  constructor(private wsService: WsService) { }

  ngOnInit(): void {
  }


  testCode() {
    const socket = this.wsService.connect('/matchmaking', {test: "true", code : this.code})
    socket.on('match found', (data) => {
      console.log(data)
    })

    socket.on('round actions', (data) => {
      console.log(data)
    })

    socket.on('end test phase', (data) => {
      console.log("test ended")
    })
  }
}
