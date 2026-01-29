import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private storageKey = 'mockUsers';
  
  private initialUsers: User[] = [
    {
      id: 3,
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@sistema.com',
      password: 'admin123',
      introView: true,
      fechaRegistro: '2025-11-10'
    }
  ];

  constructor(private storageService: StorageService) {
  }

  async initializeMockData(){
    await this.storageService.setData(this.storageKey, JSON.stringify(this.initialUsers));
  }

  async getUsers(): Promise<User[]> {
    const usersJson: string = await this.storageService.getData(this.storageKey);
    return JSON.parse(usersJson);
  }

  async addUser(user: User): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...user,
      id: await this.generateId(users)
    };
    users.push(newUser);
    await this.storageService.setData(this.storageKey, JSON.stringify(users));
    return newUser;
  }

  async isEmailRegistered(email: string): Promise<boolean> {
    const users: User[] = await this.getUsers();
    return users.some(user => user.email === email);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users: User[] = await this.getUsers();
    return users.find(user => user.email === email);
  }

  async getIntroViewByEmail(email: string): Promise<boolean> {
    const user: User | undefined = await this.getUserByEmail(email);
    this.setIntroViewByEmail(email, true);
    return user? user.introView : false;
  }

  async setIntroViewByEmail(email: string, introView: boolean): Promise<void> {
    const users: User[] = await this.getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].introView = introView;
      await this.storageService.setData(this.storageKey, JSON.stringify(users));
    }
  }



  private async generateId(users: User[]): Promise<number> {
    return users.length > 0 
      ? Math.max(...users.map(user => user.id? user.id : 0)) + 1 
      : 1;
  }
}