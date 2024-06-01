import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { changepass } from 'src/app/Model/change_pass';
import { customer } from 'src/app/Model/customer';
import { Profile } from 'src/app/Model/profile';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
import { TokenStorageService } from './token-storage.service';
const baseURL = BASE_URL_API + 'api/Profile/';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient, private tokenstorage: TokenStorageService
  ) { }

  get(): Observable<any> {
    return this.http.get(baseURL + 'byuser',
      {});
  }

  post(obj: Profile): Observable<any> {
    return this.http.post(baseURL, obj);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(baseURL + id)
  }
  update(id: number, obj: Profile): Observable<any> {
    return this.http.put(baseURL + id, obj)
  }
  changepass(obj: changepass): Observable<any> {
    return this.http.put(baseURL + 'changePass/', obj)
  }
}
