import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
const baseURL = BASE_URL_API + 'api/State/';
@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(baseURL,
      {});
  }
}
