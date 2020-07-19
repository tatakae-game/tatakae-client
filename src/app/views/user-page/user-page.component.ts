import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;
  changePasswordForm: FormGroup;
  newPassword: FormControl;
  password: FormControl;

  constructor(private userService: UsersService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      password: ['', Validators.required],
    }
    );
  }

  async ngOnInit(): Promise<void> {
    await this.authService.lazy_load_session(this.authService.session().token);
    this.user = await this.userService.getMe();
  }

  update_default_language(selected_language: string) {
    this.userService.update_user_language(selected_language)
  }

  async onSubmit(value: any) {
    const res = await this.userService.update_password(value.password, value.newPassword);
  }

}
