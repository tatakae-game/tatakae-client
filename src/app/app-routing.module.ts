import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoAuthGuard } from './no-auth.guard';
import { AuthGuard } from './auth.guard';

import { EditorComponent } from './editor/editor.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/editor', },
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
