import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delete } from 'src/app/Model/delete';
import { SaleEntry } from 'src/app/Model/sale';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
import { TokenStorageService } from './token-storage.service';
const baseURL = BASE_URL_API + 'api/Sale/';
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(private http: HttpClient, private tokenstorage: TokenStorageService) { }

  get(): Observable<any> {
    return this.http.get(baseURL + parseInt(this.tokenstorage.getUser().id),
      {});
  }

  post(obj: SaleEntry): Observable<any> {
    console.log(obj)
    return this.http.post(baseURL, obj);
  }

  delete(billno: number): Observable<any> {
    let deletesaleitem: Delete = {
      billnoid: billno,
      userid: this.tokenstorage.getUser().id
    }
    const header: HttpHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', 'Bearer ' + this.tokenstorage.getToken());
    const httpOptions = {
      headers: header,
      body: deletesaleitem
    };
    return this.http.delete(baseURL, httpOptions)
  }
  update(id: number, obj: SaleEntry): Observable<any> {
    return this.http.put(baseURL + id, obj)
  }
}
