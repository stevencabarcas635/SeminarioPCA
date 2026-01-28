import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../services/theme.service';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { Theme } from '../models/theme.model';
import { NavController } from '@ionic/angular';
import { User } from '../models/user.model';
import { MockDataService } from '../services/mock-data.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonContent, NgFor, ScrollingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  colorTitle:string = '';
  colorCard:string = '';
  colorText:string = '';
  backgroundColor:string = '';
  user:User | null = null;

  constructor(
    private storage:StorageService,
    private themeService:ThemeService,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    await this.themeService.initializeTheme();
    await this.loadTheme();
  }

  async ionViewWillEnter() {
    await this.loadTheme();
  }

  private async loadTheme(){
    const theme:Theme = await this.themeService.LoadTheme();
    this.colorTitle = theme.colorTitle;
    this.colorCard = theme.colorCard;
    this.colorText = theme.colorText;
    this.backgroundColor = theme.backgroundColor;
  }

  public async changeTheme(){
    await this.themeService.changeTheme();
    await this.loadTheme();
  }
  

  musicalGenres:MusicalGenre[] = [
    {
      name: 'Pop',
      description: 'Género musical popular surgido a mediados de los años 50 en Reino Unido y EE.UU., caracterizado por melodías pegadizas, ritmo marcado y un enfoque comercial directo al público masivo.',
      subgenres: ["Synth-pop", "Dance-pop", "Bedroom pop", "Pop Latino"],
      influentialArtists: ["Michael Jackson (Rey del Pop)", "Madonna", "Beyoncé", "Taylor Swift", "Lady Gaga", "Rihanna", "Coldplay", "Ed Sheeran"],
      // color: '#850C03', 
      imageUrl: 'assets/images/pop.jpg'
    },
    {
      name: 'Rock',
      description: 'El rock es un género musical popular que surgió en la década de 1950 a partir de la fusión de diversos estilos, como el blues, el folk y el rhythm and blues, y se caracteriza por un ritmo fuerte y el uso destacado de guitarras eléctricas, bajo y batería.',
      subgenres: ["Rock Alternativo", "Grunge", "Britpop", "Punk Rock", "Heavy Metal", "Rock Progresivo"],
      influentialArtists: ["The Beatles", "Led Zeppelin", "Queen", "Jimi Hendrix", "Nirvana", "Metallica", "Pink Floyd"],
      // color: '#126E82',
      imageUrl: 'assets/images/rock.jpeg'
    },
    {
      name: 'Hip-Hop',
      description: 'Género musical y movimiento cultural originado en las comunidades afroamericanas y latinas de Nueva York en la década de 1970. Se caracteriza por sus elementos de rap (canto rítmico y rimado), DJing, breaking y graffiti.',
      subgenres: ["Gangsta Rap", "Conscious Hip-Hop", "Trap", "Alternative Hip-Hop", "Hardcore Hip-Hop", "Old School Hip-Hop"],
      influentialArtists: ["DJ Kool Herc", "Afrika Bambaataa", "Grandmaster Flash", "Tupac Shakur", "The Notorious B.I.G.", "Jay-Z", "Eminem", "Kendrick Lamar"],
      // color: '#665527',
      imageUrl: 'assets/images/hiphop.jpeg'
    },
    {
      name: 'Electronic Music',
      description: 'Género amplio de música que utiliza instrumentos electrónicos y tecnología musical electrónica para su producción. Abarca una vasta gama de subgéneros, muchos de los cuales están orientados a la danza (EDM).',
      subgenres: ["House", "Techno", "Trance", "Dubstep", "Drum & Bass", "Hardstyle", "Electro Funk"],
      influentialArtists: ["Daft Punk", "Kraftwerk", "The Chemical Brothers", "Tiësto", "Calvin Harris", "Skrillex", "Avicii"],
      // color: '#27124D',
      imageUrl: 'assets/images/electronic.jpg'
    },
    {
      name: 'Jazz',
      description: 'Género musical nacido a finales del siglo XIX en los Estados Unidos, que se expandió globalmente a lo largo de todo el siglo XX. Se caracteriza por la improvisación, un ritmo sincopado conocido como swing, y el uso prominente de instrumentos como la trompeta, el saxofón, el piano y el contrabajo.',
      subgenres: ["Swing", "Bebop", "Cool Jazz", "Free Jazz", "Jazz Fusion", "Smooth Jazz", "Acid Jazz"],
      influentialArtists: ["Louis Armstrong", "Miles Davis", "Duke Ellington", "Charlie Parker", "Billie Holiday", "Ella Fitzgerald", "John Coltrane"],
      // color: '#4A4645',
      imageUrl: 'assets/images/jazz.jpeg'
    }
  ];

  goToIntro(){
    this.navCtrl.navigateRoot('/intro');
  }
}


interface MusicalGenre {
  name: string;
  description: string;
  subgenres: string[];
  influentialArtists: string[];
  // color?: string;
  imageUrl: string;
}