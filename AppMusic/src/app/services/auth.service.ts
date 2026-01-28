import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private mockDataService: MockDataService) { }

  async login(email: string, password: string): Promise<Observable<{ success: boolean; user?: User; message?: string }>>{
    const user = await this.mockDataService.getUserByEmail(email);

    if (!user) {
      return of({
        success: false,
        message: 'No se encontró una cuenta con ese correo electrónico.'
      });
    }

    if (user.password !== password) {
      return of({
        success: false,
        message: 'La contraseña es incorrecta.'
      });
    }

    this.currentUser = user;
    return of({
      success: true,
      user,
      message: 'Inicio de sesión exitoso.'
    });
  }

  async register(userData: User): Promise<{ success: boolean; message?: string }> {
    if (await this.mockDataService.isEmailRegistered(userData.email)) {
      return {
        success: false,
        message: 'Este correo electrónico ya está registrado.'
      };
    }

    const newUser = await this.mockDataService.addUser(userData);
    this.currentUser = newUser;

    return {
      success: true,
      message: 'Registro exitoso.'
    };
  }

  logout(): void {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}