import { NgModule } from "@angular/core";
import { InboxComponent } from "./inbox.component";
import { InboxMessageComponent } from "./inbox-message/inbox-message.component";
import { CommonModule } from "@angular/common";
import { InboxRoutingModule } from "./inbox-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        InboxComponent,
        InboxMessageComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InboxRoutingModule
    ]
})
export class InboxModule {}