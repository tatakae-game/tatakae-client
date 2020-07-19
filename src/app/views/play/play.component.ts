import { Component, OnInit, ViewChild } from '@angular/core';
import { WsService } from 'src/app/ws.service';
import { UsersService } from 'src/app/services/users.service';
import { CodeFile } from 'src/app/models/code_file.model';
import { GameComponent } from 'src/app/game/game.component';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @ViewChild(GameComponent)
  game: GameComponent;

  constructor(private wsService: WsService, private userService: UsersService) { }

  async ngOnInit() {
    const language = await this.userService.getRunningLanguage();
    const files = await this.userService.getUserCode(language);

    this.launch(language, files);
  }

  launch(language: string, files: [CodeFile]) {
    this.game.run(files, language, "false");
  }

}
