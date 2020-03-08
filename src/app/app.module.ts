import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './game/game.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';

import { AuthInterceptor } from './auth.interceptor';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    GameComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
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
