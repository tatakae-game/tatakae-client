import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoAuthGuard } from './no-auth.guard';
import { AuthGuard } from './auth.guard';

import { HomeComponent } from './views/home/home.component';
import { EditorComponent } from './views/editor/editor.component';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ChatComponent } from './views/chat/chat.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NoAuthGuard], },
  { path: '', pathMatch: 'full', redirectTo: '/editor', },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard], },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard], },
  { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard], },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard], },
  { path: '**', component: NotFoundComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
