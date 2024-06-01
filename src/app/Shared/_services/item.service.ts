import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { item } from 'src/app/Model/item';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
import { TokenStorageService } from './token-storage.service';
const baseURL = BASE_URL_API + 'api/Item/';
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient, private tokenstorage: TokenStorageService) { }

  get(): Observable<any> {
    return this.http.get(baseURL + parseInt(this.tokenstorage.getUser().id),
      {});
  }

  post(obj: item): Observable<any> {
    return this.http.post(baseURL, obj);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(baseURL + id)
  }
  update(id: number, obj: item): Observable<any> {
    return this.http.put(baseURL + id, obj)
  }
}
