import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { changepass } from 'src/app/Model/change_pass';
import { Profile } from 'src/app/Model/profile';
import { state } from 'src/app/Model/state';
import { ProfileService } from 'src/app/Shared/_services/profile.service';

import { StateService } from 'src/app/Shared/_services/state.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  formChangePass: changepass = {
    username: '',
    newpassword: '',
    conformpassword: '',
    passcode: '',
    oldpassword: ''
  }
  formProfile: Profile = {
    id: 0,
    userid: 0,
    companyname: '',
    gstno: '',
    statecode: '',
    mobileno: '',
    addressheading: '',
    addresstitle: '',
    passcode: '',
    email: ''
  }
  profileList: Profile[] = []
  loading: boolean = true
  binaryImage: String
  stateList: state[] = []
  constructor(
    private profile: ProfileService,
    private state: StateService,
    private toster: ToastrService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.getprofileApi()
  }
  //set empty formChangePass
  setemptychangepass() {
    this.formChangePass = {
      username: 'Not Required',
      newpassword: '',
      conformpassword: '',
      passcode: 'Not Required',
      oldpassword: ''
    }
  }
  // function to change pass
  changepass() {
    console.log(this.formChangePass)
    this.profilechnagepassApi(this.formChangePass)
  }
  FileUpload() {

  }
  // convert  image function
  convertImage(evt: any) {

  }
  //submit by pass code
  SubmitPassCode() {
    this.profileSubmit(this.formChangePass.passcode)
  }
  //submit 
  profileSubmit(passcode: string) {
    if (passcode != '') {
      this.formProfile.passcode = passcode
      if (!this.ValidatorChecker(this.formProfile.id.toString())) {
        console.log('add')
        this.addProfile()
      }
      else {
        console.log('update')
        this.updateProfile()
      }
    }
    else {
      this.toster.error('Admin pass code is required')
    }

  }
  // update profile
  updateProfile() {
    this.updateProfilteApi(this.formProfile)
  }
  // add profile
  addProfile() {
    this.addprofileApi(this.formProfile)
  }
  //validator for undefine empty null data 0
  private ValidatorChecker(data: any) {

    if (typeof data === "undefined" || data === null || data.toString() === "" || data.toString() === "0" || Number.isNaN(data)) {
      return false
    }
    else {
      return true
    }
  }
  // profile Api
  addprofileApi(profile: Profile) {
    console.log(profile)
    this.profile.post(profile).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.toster.success("Add Successfull")
          let ref = document.getElementById('cancelpasscode')
          ref.click()
          this.formChangePass = {
            username: 'Not Required',
            newpassword: '',
            conformpassword: '',
            passcode: '',
            oldpassword: ''
          }

          this.loading = false
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          this.logout()
        }
        else {
          this.toster.error(data.apiStatus.message)
          console.log(data.apiStatus.message)
        }
      },
      err => {
        this.geterror()
        // console.log(err.error)
      }
    )
  }
  getprofileApi() {
    this.profile.get().pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.formProfile = data.data
          this.getStateApi()
          this.loading = false
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          this.logout()
        }
        else {
          this.getStateApi()
          this.toster.error(data.apiStatus.message)
          console.log(data.apiStatus.message)
        }
      },
      err => {
        this.geterror()
        // console.log(err.error)
      }
    )
  }
  updateProfilteApi(profile: Profile) {
    this.profile.update(profile.id, profile).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.toster.success("Update Successfull")
          let ref = document.getElementById('cancelpasscode')
          ref.click()
          this.formChangePass = {
            username: 'Not Required',
            newpassword: '',
            conformpassword: '',
            passcode: '',
            oldpassword: ''
          }
          this.loading = false
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          this.logout()
        }
        else {
          this.toster.error(data.apiStatus.message)
          console.log(data.apiStatus.message)
        }
      },
      err => {
        this.geterror()
        // console.log(err.error)
      }
    )
  }
  profilechnagepassApi(changepass: changepass) {
    this.profile.changepass(changepass).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.toster.success("Password Chnage Successfully")
          let ref = document.getElementById('cancelpass')
          ref.click()
          this.formChangePass = {
            username: 'Not Required',
            newpassword: '',
            conformpassword: '',
            passcode: 'Not Required',
            oldpassword: ''
          }
          this.loading = false
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          this.logout()
        }
        else {
          this.toster.error(data.apiStatus.message)
          console.log(data.apiStatus.message)
        }
      },
      err => {
        this.geterror()
        // console.log(err.error)
      }
    )
  }
  //state api
  private getStateApi() {
    this.state.get().pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.stateList = data.data;
          this.loading = false
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          this.logout()
        }
        else {
          console.log(data.apiStatus.message)
        }
      },
      err => {
        this.geterror()
        // console.log(err.error)
      }
    )
  }
  private geterror() {
    this.toster.error('Check Your Network Connect Or Server Error')
    // this.logout()
  }
  private logout() {
    this.router.navigate(['/logout'])
  }
}
