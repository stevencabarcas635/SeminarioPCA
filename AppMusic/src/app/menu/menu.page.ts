import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { Theme } from '../models/theme.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MenuPage implements OnInit {
  colorTitle:string = '';
  colorCard:string = '';
  colorIcon:string = '';
  backgroundColor:string = '';

  constructor(private themeService: ThemeService, private storage: StorageService, private router: Router, private menuController: MenuController) {}

  async ngOnInit() {
    await this.themeService.initializeTheme();
    await this.loadTheme();
    // subscribe so menu updates if theme changes while open
    this.themeService.theme$.subscribe(theme => {
      if (theme) {
        this.colorTitle = theme.colorTitle;
        this.colorCard = theme.colorCard;
        this.colorIcon = theme.colorText;
        this.backgroundColor = theme.backgroundColor;
      }
    });
  }

  async ionViewWillEnter() {
    await this.loadTheme();
  }

  async logOut() {
    await this.storage.setData('login', false);
    this.router.navigateByUrl('/login');
  }

  async changeTheme() {
    await this.themeService.changeTheme();
    await this.loadTheme();
    await this.menuController.close();
  }

  async loadTheme(){
    const theme:Theme = await this.themeService.LoadTheme();
    this.colorTitle = theme.colorTitle;
    this.colorCard = theme.colorCard;
    this.colorIcon = theme.colorText;
    this.backgroundColor = theme.backgroundColor;
  }

  goToIntro(){
    this.router.navigateByUrl('/menu/intro');  
  }

  goToHome(){ 
    this.router.navigateByUrl('/menu/home');
  }
} 
