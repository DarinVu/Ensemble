import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { ProfileCreationComponent } from "./profile-creation/profile-creation.component";
import { UserHomeComponent } from "./user-home/user-home.component";
import { EnsemblesFindComponent } from "./ensembles/ensembles-find/ensembles-find.component";
import { EnsemblesCreateComponent } from "./ensembles/ensembles-create/ensembles-create.component";
import { EnsemblesResolverService } from "./ensembles/ensembles-resolver.service";
import { EnsemblesDetailsComponent } from "./ensembles/ensembles-details/ensembles-details.component";
import { ProfileResolverService } from "./profile-creation/profile-resolver.service";
import { AuthGuard } from "./auth/auth.guard";
import { EnsemblesChatComponent } from "./ensembles/ensembles-chat/ensembles-chat.component";
import { InboxComponent } from "./inbox/inbox.component";
import { InboxMessageComponent } from "./inbox/inbox-message/inbox-message.component";

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/:status', component: AuthComponent },
    { path: 'profile-creation/:status', component: ProfileCreationComponent },
    { path: 'user-home', component: UserHomeComponent, resolve: [ProfileResolverService, EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'ensembles-find', component: EnsemblesFindComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'ensembles-create', component: EnsemblesCreateComponent, canActivate: [AuthGuard] },
    { path: 'ensembles-details/:id', component: EnsemblesDetailsComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'ensembles-details/:id/chat', component: EnsemblesChatComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'user/:id', component: UserHomeComponent, resolve: [ProfileResolverService], canActivate: [AuthGuard]},
    { path: 'inbox', component: InboxComponent, resolve: [ProfileResolverService, EnsemblesResolverService], canActivate: [AuthGuard], children:[
        { path: ':request-num', component: InboxMessageComponent, resolve: [ProfileResolverService], canActivate: [AuthGuard]}
    ]},


    
]



@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})

export class AppRoutingModule {}