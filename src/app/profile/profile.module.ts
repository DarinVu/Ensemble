import { NgModule } from "@angular/core";
import { ProfileCreationComponent } from "./profile-creation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        ProfileCreationComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: ':status', component: ProfileCreationComponent }])
    ]
})
export class ProfileModule {}