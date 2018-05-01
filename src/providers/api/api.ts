/*
  Written by: Ryan Kruse
  Standard api service, all methods take and return type T.
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Api {
  url: string = 'https://xpx-mixtape.herokuapp.com/api/';

  private _token: string;

  constructor(public http: HttpClient) {
  }

  setloginToken(token: string){
    this._token = token;
  }

  getLoginToken(cred: string){
    let headers: HttpHeaders = new HttpHeaders(
      {'Content-Type': 'application/json'}
    );

    return this.http.post(this.url + "Auth/login", cred, {headers});;
  }

  validateToken(){
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.get(this.url + "Auth/me", {headers});
  }

  getSingleEntityWithNoID<T>(path: string): Observable<T>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.get(this.url + path, {headers}) as Observable<T>;
  }

  getSingleEntity<T>(path: string, id: number): Observable<T>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.get(this.url + path + "/" + id, {headers}) as Observable<T>;
  }

  getAllEntities<T>(path: string): Observable<T[]>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.get(this.url + path, {headers}) as Observable<T[]>;
  }

  postEntity<T>(path: string, obj: any): Observable<T>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token},
    );

    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post(this.url + path, obj, {headers}) as Observable<T>;
  }

  putEntity<T>(path: string, id: number, obj: any): Observable<T>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.put(this.url + path + "/" + id, obj, {headers}) as Observable<T>;
  }

  deleteEntity<T>(path: string, id: number): Observable<T>{
    let headers: HttpHeaders = new HttpHeaders(
      {"Authorization": "Bearer " + this._token}
    );

    return this.http.delete(this.url + path + "/" + id, {headers}) as Observable<T>;
  }

  //TODO: add patch endpoint?
}
