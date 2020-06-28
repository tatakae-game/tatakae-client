import { Component, OnInit, ViewChild } from '@angular/core';
import { GameComponent } from 'src/app/game/game.component';
import { UsersService } from 'src/app/services/users.service';
import { CodeFile } from 'src/app/models/code_file.model';

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

  code: string;
  public files: [CodeFile];
  public displayed: CodeFile

  constructor(private userService : UsersService) { }

  async ngOnInit() {
    this.files = await this.userService.getUserCode('js');
    this.displayed = this.files.filter(file => file.is_entrypoint)[0];
    this.code = this.displayed.code;
  }

  switchCode(file: CodeFile) {
    this.displayed.code = this.code;
    this.displayed = file;
    this.code = this.displayed.code;
    console.log(file.code);
    console.log(this.files);
  }


  testCode() {
    this.displayed.code = this.code;
    this.game.run(this.files, 'js');
  }
}
