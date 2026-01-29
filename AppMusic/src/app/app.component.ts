import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {register} from 'swiper/element/bundle';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { MockDataService } from './services/mock-data.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private mockDataService: MockDataService, private storage: StorageService, private router: Router, private themeService: ThemeService) {
    document.addEventListener('ionPause', async () => {
      await this.handleAppPause();
    });
  }
  async ngOnInit() {
    await this.themeService.initializeTheme();
    await this.storage.remove("user");
    await this.storage.remove("introView");
    if (await this.mockDataService.getUsers() === null) {
      await this.mockDataService.initializeMockData();
    }
    await this.handleAppPause();
  }

  private async handleAppPause() {
    await this.storage.setData('login', false);
    this.router.navigateByUrl('/login');
  }
}
