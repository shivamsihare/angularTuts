import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/internal/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
  getHero(id: Number): Observable<Hero> {
    const heroUrl = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(heroUrl).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error) => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result);
    };
  }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
        tap(_ => `updated Hero id=${hero.id}`),
        catchError(this.handleError<any>('updateHero'))
      );
  }
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added Hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
}
