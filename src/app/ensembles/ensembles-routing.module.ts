import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EnsemblesFindComponent } from "./ensembles-find/ensembles-find.component";
import { EnsemblesCreateComponent } from "./ensembles-create/ensembles-create.component";
import { EnsemblesDetailsComponent } from "./ensembles-details/ensembles-details.component";
import { EnsemblesChatComponent } from "./ensembles-chat/ensembles-chat.component";
import { EnsemblesResolverService } from "./ensembles-resolver.service";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
    { path: 'find', component: EnsemblesFindComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'create', component: EnsemblesCreateComponent, canActivate: [AuthGuard] },
    { path: 'details/:id', component: EnsemblesDetailsComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] },
    { path: 'details/:id/chat', component: EnsemblesChatComponent, resolve: [EnsemblesResolverService], canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnsemblesRoutingModule {}