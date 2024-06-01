import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { changepass } from 'src/app/Model/change_pass';
import { login } from 'src/app/Model/login';
import { signup } from 'src/app/Model/signup';
import { BASE_URL_API } from '../_baseUrl/baseUrl';
import { TokenStorageService } from './token-storage.service';
const AUTH_API = BASE_URL_API + 'api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private changepassUrl = AUTH_API + 'changePass/forgetpass'
  private changepassadminPrimaryUrl = AUTH_API + 'changeAdminPassPrimary/'
  private changepassadminSecoundryUrl = AUTH_API + 'changeAdminPassSecondary/'
  private changepasssuperadminPrimaryUrl = AUTH_API + 'changeSuperAdminPassPrimary/'
  private changepasssuperadminSecoundryUrl = AUTH_API + 'changeSuperAdminPassSecondary/'
  private deleteUserUrlAdmin = AUTH_API + 'delete/'
  private deleteUserUrlSuperAdmin = AUTH_API + 'deletePrimary/'
  private updateUserUrl = AUTH_API + 'update/'
  private RoleUserUrl = AUTH_API + 'role/'
  private changepassbyadminUrl = AUTH_API + 'changePassForAdmin/'

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
  ) { }

  login(credentials: login): Observable<any> {
    return this.http.post<any>(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }).pipe(map(data => {

      // login successful if there's a jwt token in the response
      if (data && data.accessToken) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.tokenStorage.saveToken(data.accessToken);
        //this.tokenStorage.savePass(credentials.password)

      }
      return data;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.tokenStorage.signOut();
  }

  register(user: signup): Observable<any> {
    // console.log(user)
    return this.http.post(AUTH_API + 'signup', user);
  }
  changePasswordSuperAdminPrimary(password: any, username: any): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepasssuperadminPrimaryUrl + username, {
      oldpassword: password.oldpassword,
      newpassword: password.newpassword,
      conformpassword: password.conformpassword
    })
  }
  changePasswordSuperAdminSecoundry(password: any, username: any): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepasssuperadminSecoundryUrl + username, {
      oldpassword: password.oldpassword,
      newpassword: password.newpassword,
      conformpassword: password.conformpassword
    })
  }
  changePasswordAdminPrimary(password: any, username: any): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepassadminPrimaryUrl + username, {
      oldpassword: password.oldpassword,
      newpassword: password.newpassword,
      conformpassword: password.conformpassword
    })
  }
  changePasswordAdminSecoundry(password: any, username: any): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepassadminSecoundryUrl + username, {
      oldpassword: password.oldpassword,
      newpassword: password.newpassword,
      conformpassword: password.conformpassword
    })
  }
  changePassword(changepass: changepass): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepassUrl, changepass)
  }
  changePasswordByAdmin(password: any, username: any): Observable<any> {
    // console.log(password)
    return this.http.put(this.changepassbyadminUrl + username, {
      oldpassword: "",
      newpassword: password.newpassword,
      conformpassword: password.conformpassword
    })
  }
  delete(user: any): Observable<any> {
    return this.http.delete(this.deleteUserUrlAdmin + user, {
    })
  }
  deletePrimay(user: any): Observable<any> {
    return this.http.delete(this.deleteUserUrlSuperAdmin + user, {
    })
  }
  role(user: any): Observable<any> {
    return this.http.get(this.RoleUserUrl + user, {})
  }
  update(obj: any, user: any): Observable<any> {
    // console.log(obj)
    // console.log(user)
    return this.http.put(this.updateUserUrl + user, {
      email: obj.email,
      role: [obj.role],
      employeetype: obj.employeetype,
    })
  }
}
