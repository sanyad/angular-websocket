import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StyleBeers } from './StyleBeers';

@Injectable({
  providedIn: 'root'
})
export class StylesService {
  constructor() {}
  // readonly ROOT_STYLES_URL = 'http://localhost:3000/stylesBeer';
  // constructor(private httpClient: HttpClient) { }
  //
  // getStyles(): Observable<StyleBeers[]> {
  //   return this.httpClient.get<StyleBeers[]>(this.ROOT_STYLES_URL);
  // }
  // getStyle(id: string): Observable<StyleBeers> {
  //   return this.httpClient.get<StyleBeers>(this.ROOT_STYLES_URL + '/' + id);
  // }
  // addStyle(stl: StyleBeers) {
  //   return this.httpClient.post(this.ROOT_STYLES_URL, stl);
  // }
  // deleteStyle(stl: StyleBeers) {
  //   return this.httpClient.delete(this.ROOT_STYLES_URL + '/' + stl.id);
  // }
  // updateStyle(stl: StyleBeers) {
  //   return this.httpClient.put(this.ROOT_STYLES_URL + '/' + stl.id, stl);
  // }
}
