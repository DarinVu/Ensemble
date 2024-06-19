import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { HeaderComponent } from './header/header.component';
import { ClickOutsideDirective } from './shared/click-outside-directive';
import { EnsemblesFindComponent } from './ensembles/ensembles-find/ensembles-find.component';
import { EnsemblesCreateComponent } from './ensembles/ensembles-create/ensembles-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EnsemblesItemComponent } from './ensembles/ensembles-find/ensembles-item/ensembles-item.component';
import { EnsemblesDetailsComponent } from './ensembles/ensembles-details/ensembles-details.component';
import { EnsemblesChatComponent } from './ensembles/ensembles-chat/ensembles-chat.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { UserComponent } from './user/user.component';
import { InboxComponent } from './inbox/inbox.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProfileCreationComponent,
    UserHomeComponent,
    EnsemblesFindComponent,
    HeaderComponent,
    ClickOutsideDirective,
    EnsemblesCreateComponent,
    EnsemblesItemComponent,
    EnsemblesDetailsComponent,
    EnsemblesChatComponent,
    LoadingSpinnerComponent,
    UserComponent,
    InboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
