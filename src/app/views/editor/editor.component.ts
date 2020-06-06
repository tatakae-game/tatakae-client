import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from 'src/app/game/game.component';

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

  @ViewChild(GameComponent)
  game: GameComponent;

  code = 'robot.walk(2)\n';

  constructor() { }

  ngOnInit(): void {
  }


  testCode() {
    this.game.run(this.code);
  }
}
