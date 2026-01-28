import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InputComponent {
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() maxlength!: string;
  @Input() FormControlName!: string;
  isPasswordVisible: boolean = false;

  @Input() control: AbstractControl | null = null;
  onTouched: any = () => { };


  get inputType(): string {
    if (this.type === 'password' && this.isPasswordVisible) {
      return 'text';
    }
    return this.type;
  }

  togglePasswordVisibility() {
    if (this.type === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
  }

  get showError(): boolean {
    if (!this.control) {
      return false;
    }
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  onInputChanged(event: any) {
    const value = event.detail.value;
    if (this.control) {
      this.control.setValue(value, { emitEvent: true });
      this.control.markAsDirty();
    }
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}