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

  modifiedName: string;
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
    console.log(this.files)
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

  addFile() {
    this.displayed.code = this.code

    const new_file = {} as CodeFile
    new_file.code = ''
    new_file.is_entrypoint = false

    let number = this.files.length

    while (this.files.map(file => file.name).includes(`file${number}.js`)) {
      number++
    }

    new_file.name = `file${number}.js`;
    this.files.push(new_file)

    this.displayed = new_file;
    this.code = this.displayed.code;

    new_file.changeText = true;
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

  renameFile(file: CodeFile, input: KeyboardEvent) {
    const new_filename: string = input.target["value"]
    if(new_filename.trim() === '' ) {
      return
    }
    file.name = new_filename
    this.storeInCache();
  }
}
