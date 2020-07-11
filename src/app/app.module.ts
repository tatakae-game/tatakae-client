import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './game/game.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';

import { NotFoundComponent } from './views/not-found/not-found.component';
import { HomeComponent } from './views/home/home.component';
import { RoomComponent } from './views/room/room.component';
import { UserControlComponent } from './user-control/user-control.component';
import { RoomsComponent } from './views/rooms/rooms.component';
import { PlayComponent } from './views/play/play.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button'; 

import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { PermissionGroupsComponent } from './views/dashboard/permission-groups/permission-groups.component';
import { MaterialModule } from './modules/material.module';
import { PermissionsGroupDialogComponent } from './views/dialogs/permissions-groups-dialog/permissions-groups-dialog.component';
import { UserPageComponent } from './views/user-page/user-page.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    GameComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    RoomComponent,
    UserControlComponent,
    RoomsComponent,
    PlayComponent,
    DashboardAdminComponent,
    PermissionGroupsComponent,
    PermissionsGroupDialogComponent,
    UserPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    FontAwesomeModule,
    TooltipModule,
    MaterialModule,
    MonacoEditorModule.forRoot(),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right",
          distance: 12
        },
        vertical: {
          position: "top",
          distance: 12,
          gap: 10
        }
      },
      theme: "material",
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: "pauseAutoHide",
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: "slide",
          speed: 300,
          easing: "ease"
        },
        hide: {
          preset: "fade",
          speed: 300,
          easing: "ease",
          offset: 50
        },
        shift: {
          speed: 300,
          easing: "ease"
        },
        overlap: 150
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
