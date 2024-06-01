import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environmentProduct } from '../_baseUrl/environmentVariable';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent {

  app_roles = '';
  isLoggedIn = false;
  showAdminBoard = true;
  showModeratorBoard = false;
  username: string;
  isLoginFailed = false;
  errorMessage = '';
  user: string
  pass: string

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private toster: ToastrService,

  ) { }

  ngOnInit(): void {
    this.setUserLoginData()
  }
  setUserLoginData() {
    let userLoginData: string = ''
    if (this.ValidatorChecker(this.tokenStorage.getUser())) {
      userLoginData = this.tokenStorage.getUser().accessToken
      if (userLoginData != '') {
        this.tokenStorage.saveToken(userLoginData)
        this.router.navigate(['/sale'])
        this.isLoggedIn = true
      }
      else {
        this.isLoggedIn = false
        this.router.navigate(['login'])
      }
    }
    else {
      console.log('Token Error Please Relogin')
      this.isLoggedIn = false
      this.router.navigate(['login'])
    }

  }
  private ValidatorChecker(data: any) {

    if (typeof data === "undefined" || data === null) {
      return false
    }
    else {
      return true
    }
  }
}
