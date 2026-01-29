import { Routes } from '@angular/router';
import { HomeIntroGuard, HomeGuard, LoginRegisterGuard } from './guards/intro-guard';

export const routes: Routes = [
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.page').then((m) => m.MenuPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
        canActivate: [HomeGuard, HomeIntroGuard],
      },
      {
        path: 'intro',
        loadComponent: () => import('./intro/intro.page').then((m) => m.IntroPage),
        canActivate: [HomeIntroGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'menu/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    canActivate: [LoginRegisterGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
    canActivate: [LoginRegisterGuard],
  },
  {
    path: 'songs-modal',
    loadComponent: () => import('./songs-modal/songs-modal.page').then( m => m.SongsModalPage)
  },
];
