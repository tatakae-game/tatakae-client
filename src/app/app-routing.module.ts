import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoAuthGuard } from './no-auth.guard';
import { AuthGuard } from './auth.guard';

import { HomeComponent } from './views/home/home.component';
import { EditorComponent } from './views/editor/editor.component';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { RoomComponent } from './views/room/room.component';
import { RoomsComponent } from './views/rooms/rooms.component';
import { PlayComponent } from './views/play/play.component';
import { PermissionGroupsComponent } from './views/dashboard/permission-groups/permission-groups.component';
import { UserPageComponent } from './views/user-page/user-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [NoAuthGuard], },
  { path: 'dashboard/groups', component: PermissionGroupsComponent, canActivate: [AuthGuard], },
  { path: 'chat', component: RoomsComponent, canActivate: [AuthGuard], },
  { path: 'chat/room/:id', component: RoomComponent, canActivate: [AuthGuard], },
  { path: 'support', component: RoomsComponent, canActivate: [AuthGuard], },
  { path: 'user', component: UserPageComponent, canActivate: [AuthGuard], },
  { path: 'support/ticket/:id', component: RoomComponent, canActivate: [AuthGuard], },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard], },
  { path: 'play', component: PlayComponent, canActivate: [AuthGuard], },
  { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard], },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard], },
  { path: '**', component: NotFoundComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
