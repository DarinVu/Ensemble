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

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/:status', component: AuthComponent },
    { path: 'profile-creation', component: ProfileCreationComponent },
    { path: 'user-home', component: UserHomeComponent, resolve: [ProfileResolverService], canActivate: [AuthGuard] },
    { path: 'ensembles-find', component: EnsemblesFindComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'ensembles-create', component: EnsemblesCreateComponent, canActivate: [AuthGuard] },
    { path: 'ensembles-details/:id', component: EnsemblesDetailsComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] }
]



@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})

export class AppRoutingModule {}