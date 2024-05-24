import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { ProfileCreationComponent } from './profile-creation/profile-creation.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { EnsemblesComponent } from './ensembles/ensembles.component';
import { HeaderComponent } from './header/header.component';
import { ClickOutsideDirective } from './shared/click-outside-directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProfileCreationComponent,
    UserHomeComponent,
    EnsemblesComponent,
    HeaderComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
