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

  language: string;
  code: string;
  public files: CodeFile[];
  public displayed: CodeFile

  constructor(private userService: UsersService) { }

  async ngOnInit() {
    this.language = await this.userService.getRunningLanguage();
    this.files = await this.userService.getUserCode(this.language);
    this.displayed = this.files.filter(file => file.is_entrypoint)[0];
    this.code = this.displayed.code;
  }

  switchCode(file: CodeFile) {
    this.displayed.code = this.code;
    this.displayed = file;
    this.code = this.displayed.code;
  }


  testCode() {
    this.displayed.code = this.code;
    this.game.run(this.files, this.language);
  }

  async saveCode() {
    this.displayed.code = this.code;
    const res = await this.userService.saveCode(this.files, this.language)
    
    if (res) {
      localStorage.removeItem(`${this.language}_code`)
    }
    console.log(res)
  }

  setEntrypoint() {
    this.files.forEach(file => file.is_entrypoint = false)
    this.displayed.is_entrypoint = true
    localStorage.setItem(`${this.language}_code`, btoa(JSON.stringify(this.files)))
  }

  storeInCache() {
    this.displayed.code = this.code
    localStorage.setItem(`${this.language}_code`, btoa(JSON.stringify(this.files)))
  }

  renameFile(file: CodeFile) {
    file.name = "renamed"
  }


  deleteFile() {
    if(this.files.length <= 1) {
      return console.log(`can't delete last file`)
    }

    this.files = this.files.filter(file => file !== this.displayed)
    if(this.files.filter(file => file.is_entrypoint).length === 0) { 
      this.files[0].is_entrypoint = true
    }

    this.displayed = this.files[0]
    this.code = this.displayed.code
  }
}
