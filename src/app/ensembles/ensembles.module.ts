import { NgModule } from "@angular/core";
import { EnsemblesCreateComponent } from "./ensembles-create/ensembles-create.component";
import { EnsemblesItemComponent } from "./ensembles-find/ensembles-item/ensembles-item.component";
import { EnsemblesDetailsComponent } from "./ensembles-details/ensembles-details.component";
import { EnsemblesChatComponent } from "./ensembles-chat/ensembles-chat.component";
import { EnsemblesFindComponent } from "./ensembles-find/ensembles-find.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { EnsemblesRoutingModule } from "./ensembles-routing.module";
import { HeaderComponent } from "../shared/header/header.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        EnsemblesCreateComponent,
        EnsemblesItemComponent,
        EnsemblesDetailsComponent,
        EnsemblesChatComponent,
        EnsemblesFindComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EnsemblesRoutingModule,
        SharedModule
    ]
})

export class EnsemblesModule {}