import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
import { TokenStorageService } from './token-storage.service';
const baseURL = BASE_URL_API + 'api/Report/';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private sale: string = baseURL + "Sale/"
  constructor(
    private http: HttpClient,
    private tokenstorage: TokenStorageService
  ) { }

  getSale(): Observable<any> {
    return this.http.get(this.sale + parseInt(this.tokenstorage.getUser().id),
      {});
  }
}
