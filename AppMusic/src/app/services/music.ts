import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Music {

  URL_API:string = 'https://music.fly.dev';
  
  constructor() {}

  getTracks():Promise<any[]> {
    return fetch(`${this.URL_API}/tracks`)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error fetching tracks:', error);
        return [];
      });
  }

  getAlbums(): Promise<any[]>{
    return fetch(`${this.URL_API}/albums`)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error fetching albums:', error);
        return [];
      });
  }

  async getSongsByAlbum(albumId: string){
    return await fetch(`${this.URL_API}/tracks/album/${albumId}`)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error(`Error fetching songs for album ${albumId}:`, error);
        return [];
      });
  }
}
