import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InboxComponent } from "./inbox.component";
import { InboxMessageComponent } from "./inbox-message/inbox-message.component";
import { ProfileResolverService } from "../profile/profile-resolver.service";
import { EnsemblesResolverService } from "../ensembles/ensembles-resolver.service";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
    { path: '', component: InboxComponent, resolve: [ProfileResolverService, EnsemblesResolverService], canActivate: [AuthGuard], children:[
        { path: ':request-num', component: InboxMessageComponent, resolve: [ProfileResolverService], canActivate: [AuthGuard]}
    ]},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class InboxRoutingModule {}