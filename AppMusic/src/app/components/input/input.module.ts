import { NgModule } from "@angular/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { InputComponent } from "./input.component";
import { CommonModule } from "@angular/common";
import { IonItem, IonInput } from "@ionic/angular/standalone";
import { IonIcon } from "@ionic/angular/standalone";
import { NgIf, NgClass } from "@angular/common";


@NgModule({
    declarations: [InputComponent],
    imports: [CommonModule, IonItem, IonInput, IonIcon, NgIf, NgClass],
    exports: [InputComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class InputModule {

}