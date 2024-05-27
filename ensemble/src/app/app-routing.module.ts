import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { ProfileCreationComponent } from "./profile-creation/profile-creation.component";
import { UserHomeComponent } from "./user-home/user-home.component";
import { EnsemblesFindComponent } from "./ensembles/ensembles-find/ensembles-find.component";
import { EnsemblesCreateComponent } from "./ensembles/ensembles-create/ensembles-create.component";
import { EnsemblesResolverService } from "./ensembles/ensembles-resolver.service";

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'auth/:status', component: AuthComponent },
    { path: 'profile-creation', component: ProfileCreationComponent },
    { path: 'user-home', component: UserHomeComponent },
    { path: 'ensembles-find', component: EnsemblesFindComponent, resolve: [EnsemblesResolverService] },
    { path: 'ensembles-create', component: EnsemblesCreateComponent }
]



@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})

export class AppRoutingModule {}