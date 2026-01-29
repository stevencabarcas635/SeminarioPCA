import { CanActivate} from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn:'root'
})

export class HomeGuard implements CanActivate{
  constructor( private storage:StorageService, private router:Router){}

  async canActivate(){
    const introView:boolean = await this.storage.getData('introView');
    if (introView){
      return true
    }
    this.router.navigateByUrl('menu/intro');
    return false;
  }
}


@Injectable({
  providedIn:'root'
})

export class LoginRegisterGuard implements CanActivate{
  constructor(private storage:StorageService, private router:Router){}
  async canActivate(){
    const loginUser: string = await this.storage.getData('login');
    if (loginUser){
      this.router.navigateByUrl('menu/home');
      return true;
    }else{
      return true
    }
  }
}

@Injectable({
  providedIn:'root'
})

export class HomeIntroGuard implements CanActivate{
  constructor(private storage:StorageService, private router:Router){}
  async canActivate(){
    const loginUser: string = await this.storage.getData('login');
    if (loginUser){
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}






