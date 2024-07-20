import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { ClickOutsideDirective } from "./click-outside-directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { SafePipe } from "./safe.pipe";
import { EmbedPipe } from "./embed.pipe";
import { SetBackgroundImageDirective } from "./set-background-image.directive";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";

@NgModule ({
    declarations: [
        HeaderComponent,
        ClickOutsideDirective,
        LoadingSpinnerComponent,
        SafePipe,
        EmbedPipe,
        SetBackgroundImageDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HeaderComponent,
        ClickOutsideDirective,
        LoadingSpinnerComponent,
        SafePipe,
        EmbedPipe,
        SetBackgroundImageDirective
    ]
})

export class SharedModule {}