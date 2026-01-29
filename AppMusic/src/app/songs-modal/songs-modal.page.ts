import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavParams, IonicModule, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class SongsModalPage implements OnInit {
  songs: any[] = [];
  loaded:boolean = false;
  constructor(private navParams: NavParams, private modalController: ModalController) { }

  ngOnInit() {
    this.songs = this.navParams.data['songs'];
    this.loaded = true;
  }

  async selectSong(song: any) {
    await this.modalController.dismiss(song);
    
  }

  formatDuration(durationMs: number | null | undefined): string {
    if (durationMs === null || durationMs === undefined) return '';
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDate(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const month = d.toLocaleString('en-US', { month: 'short' });
    return `${month}, ${d.getFullYear()}`;
  }

}
