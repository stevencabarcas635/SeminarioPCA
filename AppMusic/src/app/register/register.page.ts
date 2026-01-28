import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { InputComponent } from '../components/input/input.component';
import { NgIf } from '@angular/common';
import { NgClass } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
    imports: [ReactiveFormsModule, InputComponent, FormsModule, IonicModule, RouterModule, NgIf, NgClass],
})
export class RegisterPage implements OnDestroy {
  loginForm: FormGroup;
  passwordSpecialCount = 0;
  readonly requiredSpecialChars = 1;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) { 
    this.loginForm = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordStrengthValidator(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator(),
      }
    );
  }


  ngOnInit() {
    const passwordSub = this.password?.valueChanges.subscribe((value: string) => {
      this.passwordSpecialCount = this.countSpecialCharacters(value);
      this.confirmPassword?.updateValueAndValidity({ emitEvent: false });
    });

    const confirmSub = this.confirmPassword?.valueChanges.subscribe(() => {
      this.confirmPassword?.updateValueAndValidity({ emitEvent: false });
    });

    if (passwordSub) {
      this.subscriptions.push(passwordSub);
    }
    if (confirmSub) {
      this.subscriptions.push(confirmSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get nombre(): AbstractControl | null {
    return this.loginForm.get('nombre');
  }

  get apellido(): AbstractControl | null {
    return this.loginForm.get('apellido');
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.loginForm.get('confirmPassword');
  }

  get passwordStrengthClass(): string {
    if (!this.password || (!this.password.touched && !this.password.dirty)) {
      return '';
    }
    return this.passwordSpecialCount >= this.requiredSpecialChars ? 'strength-ok' : 'strength-error';
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
        cssClass: 'alert-button-custom'
      }],
      cssClass: 'custom-alert',
      animated: true
    });

    await alert.present();
  }

  async HomePage() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userData:User = {
      nombre: this.loginForm.get('nombre')?.value,
      apellido: this.loginForm.get('apellido')?.value,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      introView: false,
      fechaRegistro: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
    };

    const result:{ success: boolean; message?: string } = await this.authService.register(userData);
    if (result.success) {
      this.router.navigateByUrl('/login');
    } else {
      await this.presentAlert('Error de Registro', result.message || 'No se pudo completar el registro.');
    }
  }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value as string;
      if (!value) {
        return null;
      }

      const hasLetter = /[A-Za-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);

      return hasLetter && hasNumber && hasSpecial ? null : { passwordStrength: true };
    };
  }

  private passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const passwordValue = group.get('password')?.value;
      const confirmValue = group.get('confirmPassword')?.value;

      if (!passwordValue || !confirmValue) {
        return null;
      }

      return passwordValue === confirmValue ? null : { passwordMismatch: true };
    };
  }

  private countSpecialCharacters(value: string): number {
    if (!value) {
      return 0;
    }
    const matches = value.match(/[^A-Za-z0-9]/g);
    return matches ? matches.length : 0;
  }
}