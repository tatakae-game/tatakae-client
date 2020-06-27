import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from 'src/app/game/game.component';
import { UsersService } from 'src/app/services/users.service';

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

  constructor(private userService : UsersService) { }

  ngOnInit(): void {
      console.log(this.userService.getUserCode('js'))
  }


  testCode() {
    this.game.run(this.code);
  }
}
