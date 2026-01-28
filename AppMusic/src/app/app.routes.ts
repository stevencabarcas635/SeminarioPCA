import { Routes } from '@angular/router';
import { HomeIntroGuard, HomeGuard, LoginRegisterGuard } from './guards/intro-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage), canActivate:[HomeGuard, HomeIntroGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then( m => m.IntroPage), canActivate:[HomeIntroGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage), canActivate:[LoginRegisterGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage), canActivate:[LoginRegisterGuard]
  },
];
