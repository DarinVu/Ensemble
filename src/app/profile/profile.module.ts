import { AuthGuard } from './../auth/auth.guard';
import { NgModule } from "@angular/core";
import { ProfileCreationComponent } from "./profile-creation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { ProfileCreationGuard } from './profile-creation.guard';

@NgModule({
    declarations: [
        ProfileCreationComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild([{ path: ':status', component: ProfileCreationComponent, canActivate:[ProfileCreationGuard] }])
    ]
})
export class ProfileModule {}