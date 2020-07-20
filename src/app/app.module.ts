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
// import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './views/signup/signup.component';
import { LoginComponent } from './views/login/login.component';

import { NotFoundComponent } from './views/not-found/not-found.component';
import { HomeComponent } from './views/home/home.component';
import { RoomComponent } from './views/room/room.component';
import { UserControlComponent } from './user-control/user-control.component';
import { RoomsComponent } from './views/rooms/rooms.component';
import { PlayComponent } from './views/play/play.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { PermissionGroupsComponent } from './views/dashboard/permission-groups/permission-groups.component';
import { MaterialModule } from './modules/material.module';
import { PermissionsGroupDialogComponent } from './views/dialogs/permissions-groups-dialog/permissions-groups-dialog.component';
import { UserPageComponent } from './views/user-page/user-page.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    GameComponent,
    // HeaderComponent,
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
    MatSelectModule,
    MatInputModule,
    NzAffixModule,
    NzAlertModule,
    NzAnchorModule,
    NzAutocompleteModule,
    NzAvatarModule,
    NzBackTopModule,
    NzBadgeModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzCardModule,
    NzCarouselModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzCommentModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzI18nModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzListModule,
    NzMentionModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzNoAnimationModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzProgressModule,
    NzRadioModule,
    NzRateModule,
    NzResultModule,
    NzSelectModule,
    NzSkeletonModule,
    NzSliderModule,
    NzSpinModule,
    NzStatisticModule,
    NzStepsModule,
    NzSwitchModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzTimelineModule,
    NzToolTipModule,
    NzTransButtonModule,
    NzTransferModule,
    NzTreeModule,
    NzTreeSelectModule,
    NzTypographyModule,
    NzUploadModule,
    NzWaveModule,
    NzResizableModule,
    NzSpaceModule,
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
