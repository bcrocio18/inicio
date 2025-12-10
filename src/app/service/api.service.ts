import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi = 'https://rickandmortyapi.com/api/character/1,183';
  private fakeDB: any[] = [];

  constructor(private http: HttpClient) {
    // Cargar datos de localStorage si existen
    const saved = localStorage.getItem('fakeDB');
    if (saved) {
      this.fakeDB = JSON.parse(saved);
    }
  }

  // GET real
  getData(): Observable<any> {
    return this.http.get(this.urlApi);
  }

  // POST simulado
  createCharacter(newCharacter: any): Observable<any> {
    newCharacter.id = this.fakeDB.length + 1000;
    this.fakeDB.push(newCharacter);

    // Guardar en localStorage
    localStorage.setItem('fakeDB', JSON.stringify(this.fakeDB));

    console.log("POST simulado:", newCharacter);
    return of(newCharacter);
  }

  getFakeDB(): Observable<any[]> {
    return of(this.fakeDB);
  }
}
