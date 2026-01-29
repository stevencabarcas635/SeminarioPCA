import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, ModalController} from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ThemeService } from '../services/theme.service';

import { ScrollingModule} from '@angular/cdk/scrolling';
import { User } from '../models/user.model';
import { Music } from '../services/music';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonContent, NgFor, ScrollingModule, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorTitle:string = '';
  colorCard:string = '';
  colorText:string = '';
  backgroundColor:string = '';
  user:User | null = null;
  tracks:any[] = [];
  albums:any[] = [];
  loaded: boolean = false;
  songSelected:any = {
    name: '',
    preview_url: '',
    duration_ms: null,
    playing:false
  };

  currentSong:any = {};
  elapsedMs:number = 0;
  progressValue:number = 0;

  constructor(
    private musicService:Music,
    private themeService:ThemeService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    await this.themeService.initializeTheme();

    this.themeService.theme$.subscribe((theme) => {
      if (theme) {
        this.colorTitle = theme.colorTitle;
        this.colorCard = theme.colorCard;
        this.colorText = theme.colorText;
        this.backgroundColor = theme.backgroundColor;
      }
    });

    const theme = await this.themeService.LoadTheme();
    this.colorTitle = theme.colorTitle;
    this.colorCard = theme.colorCard;
    this.colorText = theme.colorText;
    this.backgroundColor = theme.backgroundColor;

    await this.loadTracksAndAlbums();
  }

  private async loadTracksAndAlbums(){
    this.tracks = await this.musicService.getTracks();
    this.loaded = true;
    this.albums = await this.musicService.getAlbums();
  }

  async loadSongsByAlbum(albumId: string){
    const songs = await this.musicService.getSongsByAlbum(albumId);
    const modal = await this.modalController.create({
      component: SongsModalPage,
      componentProps: {
        songs: songs,
      },
    });
    modal.onDidDismiss().then((result) => {
      if(result.data){
        this.songSelected = result.data;
      }
    });
    modal.present();
  }

  formatDuration(durationMs: number | null | undefined): string {
    if (durationMs === null || durationMs === undefined){
       return '0:00';
    }
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; 
  }

  play(){
    try { if (this.currentSong && this.currentSong.pause) { this.currentSong.pause(); } } catch(e){}

    this.currentSong = new Audio(this.songSelected.preview_url);

    this.currentSong.addEventListener('timeupdate', () => {
      const current = this.currentSong.currentTime || 0; // seconds
      const duration = this.currentSong.duration || 0; // seconds
      this.elapsedMs = Math.floor(current * 1000);
      this.progressValue = duration > 0 ? (current / duration) : 0;
    });

    this.currentSong.addEventListener('ended', () => {
      this.songSelected.playing = false;
      this.progressValue = 0;
      this.elapsedMs = 0;
    });

    this.currentSong.play();
    this.songSelected.playing = true;
  }

  pause(){
    if (this.currentSong && this.currentSong.pause) {
      this.currentSong.pause();
    }
    this.songSelected.playing = false;
  }

  getRemainngTime(){
    if (!this.currentSong.duration || !this.currentSong.currentTime) {
      return '0:00';
    }
    const remainingTime = this.currentSong.duration - this.currentSong.currentTime;
    return this.formatDuration(remainingTime * 1000);
  }
}



