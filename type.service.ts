import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TypeRecipe } from './TypeRecipe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  constructor() {}

  // readonly ROOT_TYPES_URL = 'http://localhost:3000/types';
  // constructor(private httpClient: HttpClient) { }
  //
  // getTypes(): Observable<TypeRecipe[]> {
  //   return this.httpClient.get<TypeRecipe[]>(this.ROOT_TYPES_URL);
  // }
  // getType(id: string): Observable<TypeRecipe> {
  //   return this.httpClient.get<TypeRecipe>(this.ROOT_TYPES_URL + '/' + id);
  // }
  // addType(type: TypeRecipe) {
  //   return this.httpClient.post(this.ROOT_TYPES_URL, type);
  // }
  // deleteType(type: TypeRecipe) {
  //   return this.httpClient.delete(this.ROOT_TYPES_URL + '/' + type.id);
  // }
  // updateType(type: TypeRecipe) {
  //   return this.httpClient.put(this.ROOT_TYPES_URL + '/' + type.id, type);
  // }
}
