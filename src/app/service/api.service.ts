import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlApi = 'https://rickandmortyapi.com/api';
  private fakeDB: any[] = [];

  constructor(private http: HttpClient) {
    // Cargar datos de localStorage si existen
    const saved = localStorage.getItem('fakeDB');
    if (saved) {
      this.fakeDB = JSON.parse(saved);
    }
  }

/** Traer personaje: primero revisa fakeDB, si no está, busca en API */
  getPersonaje(id: number | string): Observable<any> {
    // Si es de la API (ID < 1000)
    if (typeof id === 'string' && parseInt(id) < 1000) {
      return this.http.get(`https://rickandmortyapi.com/api/character/${id}`);
    }
    
    // Si es de fakeDB
    return this.getFakeDB().pipe(
      map((db: any[]) => db.find(p => p.id == id) || null)
    );
  }

  /** Traer “historial” de un personaje */
  getPeliculas(id: number): Observable<any[]> {
  const local = this.fakeDB.find(p => p.id === id);
  if (local) {
    return of(local.historial || [{ name: 'No hay historial registrado' }]);
  }

  // Si es de la API
  return this.getPersonaje(id).pipe(
    switchMap((personaje: any) => {
      if (!personaje || !personaje.episode || personaje.episode.length === 0) {
        return of([{ name: 'No hay historial disponible' }]);
      }

      // IDs de episodios
      const episodeIds = personaje.episode.map((url: string) => url.split('/').pop()).join(',');

      // Traemos episodios de la API
      return this.http.get(`${this.urlApi}/episode/${episodeIds}`).pipe(
        map((data: any) => Array.isArray(data) ? data : [data]),
        catchError(() => of([{ name: 'No se pudo cargar historial' }]))
      );
    })
  );
}

  /** Crear personaje local */
  createCharacter(newCharacter: any): Observable<any> {
    newCharacter.id = this.fakeDB.length + 1000; // IDs grandes para diferenciar de API
    newCharacter.historial = newCharacter.historial || [];
    this.fakeDB.push(newCharacter);
    localStorage.setItem('fakeDB', JSON.stringify(this.fakeDB));
    return of(newCharacter);
  }

  // GET real
  getData(): Observable<any> {
    return this.http.get('https://rickandmortyapi.com/api/character');
  }


  getFakeDB(): Observable<any[]> {
    return of(this.fakeDB);
  }
}
