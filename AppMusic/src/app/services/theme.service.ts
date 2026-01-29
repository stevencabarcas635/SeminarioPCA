import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme | null>(null);
  public theme$ = this.themeSubject.asObservable();

  constructor(private storage: StorageService) {}

  async initializeTheme(): Promise<void> {
    const currentTheme = await this.storage.getData('theme');
    if (currentTheme === null) {
      await this.changeTheme();
    } else {
      const theme = await this.LoadTheme();
      this.themeSubject.next(theme);
    }
  }

  async changeTheme(): Promise<Theme> {
    const currentTheme = await this.storage.getData('theme');
    const newTheme: string = currentTheme === 'light' ? 'dark' : 'light';
    
    await this.storage.setData('theme', newTheme);
    await this.storage.setData('colorTitle', `var(--color-TitleCard-${newTheme})`);
    await this.storage.setData('colorCard', `var(--color-Card-${newTheme})`);
    await this.storage.setData('colorText', `var(--color-Text-${newTheme})`);
    await this.storage.setData('backgroundColor', `var(--color-Background-${newTheme})`);

    const theme = await this.LoadTheme();
    this.themeSubject.next(theme);
    return theme;
  }

  async LoadTheme():Promise<Theme>{
    const theme:Theme = {
        colorTitle: await this.storage.getData('colorTitle'),
        colorCard: await this.storage.getData('colorCard'),
        colorText: await this.storage.getData('colorText'),
        backgroundColor: await this.storage.getData('backgroundColor'),
    }
    return theme;
  }
} 

