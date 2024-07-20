import { NgModule } from "@angular/core";
import { UserHomeComponent } from "./user-home.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
    declarations: [
        UserHomeComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule {}