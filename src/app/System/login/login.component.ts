import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { changepass } from 'src/app/Model/change_pass';
import { login } from 'src/app/Model/login';
import { LoginSignup, signup } from 'src/app/Model/signup';
import { AuthService } from 'src/app/Shared/_services/auth.service';
import { MessageService } from 'src/app/Shared/_services/message.service';
import { TokenStorageService } from 'src/app/Shared/_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: login = {
    username: '',
    password: ''
  };
  formAdd: LoginSignup = {
    email: '',
    password: '',
    conformopassword: '',
    adminpasscode: ''
  }
  isLoggedIn: boolean;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  roles = '';
  returnUrl: string;
  submitted = false;
  role_data = '';
  projectManager = false;
  loading = false
  loadingsignup = false
  loadingchangepass = false

  formChangePass: changepass = {
    username: '',
    newpassword: '',
    conformpassword: '',
    passcode: '',
    oldpassword: ''
  }
  userName: string
  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private toster: ToastrService,
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.isgettoken(this.tokenStorage.getToken() || '')
    if (this.isLoggedIn) {
      this.status();
    }
  }
  private registration(obj: signup) {
    this.loadingsignup = true
    this.authService.register(obj).pipe(first()).subscribe(
      data => {
        if (data.message === 'User registered successfully!') {
          let ref = document.getElementById('cancelAdd')
          this.formAdd = {
            adminpasscode: '',
            conformopassword: '',
            email: '',
            password: ''
          }
          ref.click(),
            this.toster.success(data.message),
            this.loadingsignup = false
        }
        else if (data.message === 'Admin Pass Code Not Match!') {
          this.toster.error(data.message)
          this.loadingsignup = false
        }
        else if (data['message'] === 'Username is already taken!') {
          this.formAdd = {
            adminpasscode: '',
            conformopassword: '',
            email: '',
            password: ''
          }
          this.toster.error(data.message)
          this.loadingsignup = false
        }
        else if (data.message === 'Email is already in use!') {
          this.toster.error(data.message)
          this.loadingsignup = false
        }
        else {
          console.log(data.message)
          this.loadingsignup = false
        }
      },
      err => {
        // this.geterror()
        this.toster.error(err.err)
        this.loadingsignup = false
      }
    )
  }
  private changePass(obj: changepass) {
    this.loadingchangepass = true
    this.authService.changePassword(obj).pipe(first()).subscribe(
      data => {
        console.log(data)
        if (data.apiStatus.message === 'OK') {

          let ref = document.getElementById('cancelchangepass')
          if (ref === null) {
            // console.log("null")
          }
          else {
            this.formChangePass = {
              conformpassword: '',
              newpassword: '',
              passcode: '',
              username: '',
              oldpassword: ''
            }
            ref.click(),
              this.toster.success(data.data),
              this.loadingchangepass = false
          }
        }
        else {
          this.toster.error(data.apiStatus.message)
          this.loadingchangepass = false
        }
      },
      err => {
        // this.geterror()
        this.toster.error(err.error)
        this.loadingchangepass = false
      }
    )
  }
  private status() {
    this.router.navigate(['sale'])
  }
  reloadPage(): void {
    window.location.reload();
  }
  forgetpassowrd() {
    let changePass: changepass = this.formChangePass
    this.changePass(changePass)
  }
  addcustomer() {
    if (this.formAdd.password === this.formAdd.conformopassword) {
      let singupobj: signup = {
        email: this.formAdd.email,
        password: this.formAdd.password,
        role: ['admin'],
        username: this.formAdd.email,
        passcode: this.formAdd.adminpasscode
      }
      // console.log(singupobj)
      this.registration(singupobj)
    }
    else {
      this.toster.error('Password not Matched')
    }
  }
  onSubmit() {
    this.loading = true
    if (this.form.password.length >= 6) {
      this.submitted = true;
      this.authService.login(this.form)
        .pipe(first())
        .subscribe(
          data => {
            if (this.tokenStorage.getToken() === null) {
              this.toster.error('UserID or Password Invalid')
              this.loading = false
            } else {
              this.loading = false
              this.tokenStorage.saveUser(data);
              this.toster.success('Login Success')
              this.router.navigate(['/sale']).then(() => {
                window.location.reload();
              });
            }

          },
          err => {
            this.loading = false
            this.isLoginFailed = true;
            this.toster.error('Check Your Network Connection')
            this.errorMessage = err.error.message;
          }
        );
    }
    else {
      this.toster.error('lenght of password is Must be grater then or equal 6')
      this.loading = false
    }

  }
  private isgettoken(token: string): boolean {
    console.log(token)
    let result = false
    if (token != '') {
      result = true
    }
    return result
  }
}
