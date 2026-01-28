import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { InputComponent } from '../components/input/input.component';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../services/mock-data.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, InputComponent, RouterLink]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService,
    private storage: StorageService,
    private mockDataService: MockDataService
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit() {
    await this.storage.remove("user");
    await this.storage.remove("introView");
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'Intentar de nuevo',
        cssClass: 'alert-button-custom'
      }],
      cssClass: 'custom-alert',
      animated: true
    });

    await alert.present();
  }

  async onLogin() {    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    const observableResult = await this.authService.login(email, password);
    observableResult.subscribe(async (result: { success: boolean; user?: User; message?: string }) => {
      if (result.success) {
        await this.storage.setData('login', true);
        await this.storage.setData('user', result.user);
        this.storage.setData('introView', result.user?.introView);
        this.navCtrl.navigateForward('home');
      } else {
        await this.presentAlert('Error de Autenticación', result.message || 'Credenciales inválidas.');
      }
    });
  }

}
