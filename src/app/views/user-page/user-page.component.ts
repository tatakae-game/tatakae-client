import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;

  constructor(private userService: UsersService ) { }

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getMe()
  }

  update_default_language(selected_language: string){
    this.userService.update_user_language(selected_language)
  }

}
