import { NgModule } from "@angular/core";
import { UserHomeComponent } from "./user-home.component";
import { RouterModule, Routes } from "@angular/router";
import { ProfileResolverService } from "../profile/profile-resolver.service";
import { EnsemblesResolverService } from "../ensembles/ensembles-resolver.service";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
    { path: 'home', component: UserHomeComponent, resolve: [ProfileResolverService, EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: ':id', component: UserHomeComponent, resolve: [ProfileResolverService], canActivate: [AuthGuard]},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}