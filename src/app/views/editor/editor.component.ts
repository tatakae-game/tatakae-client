import { Component, OnInit, ViewChild } from '@angular/core';

import { GameComponent } from 'src/app/game/game.component';
import { UsersService } from 'src/app/services/users.service';
import { CodeFile, GenerateCodeFile } from 'src/app/models/code_file.model';
import { NotifierService } from 'angular-notifier';

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

  constructor(private userService: UsersService, private notifierService: NotifierService) { }

  async ngOnInit() {
    this.language = await this.userService.getRunningLanguage();
    this.instantiate_code(this.language)
  }

  async instantiate_code(language: string) {
    this.files = await this.userService.getUserCode(this.language);
    if (this.files === null) {
      this.files = [GenerateCodeFile()];
    }
    this.files.forEach(file => file.changeText = false)
    const entrypoint = this.files.filter(file => file.is_entrypoint)[0];
    this.displayed = entrypoint;
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
    
    this.notifierService.notify((res.success === true ? 'success' : 'error'), res.errors[0]);
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

    while (this.files.map(file => file.name).includes(`file${number}.${this.language}`)) {
      number++
    }

    new_file.name = `file${number}.${this.language}`;
    this.files.push(new_file)

    this.displayed = new_file;
    this.code = this.displayed.code;

    new_file.changeText = true;
  }


  deleteFile() {
    if (this.files.length <= 1) {
      return console.log(`can't delete last file`)
    }

    this.files = this.files.filter(file => file !== this.displayed)
    if (this.files.filter(file => file.is_entrypoint).length === 0) {
      this.files[0].is_entrypoint = true
    }

    this.displayed = this.files[0]
    this.code = this.displayed.code

    this.storeInCache()
  }

  renameFile(file: CodeFile, input: KeyboardEvent) {
    const new_filename: string = input.target["value"]
    if (new_filename.trim() === '') {
      return
    }
    file.name = new_filename
    this.storeInCache();
  }

  async getCode(language: string) {
    if (this.language === language) {
      return
    }

    this.language = language

    this.instantiate_code(language)
  }
}
