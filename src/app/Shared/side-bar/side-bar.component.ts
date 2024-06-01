import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environmentProduct } from '../_baseUrl/environmentVariable';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  projectManager = false
  username = 'none'
  role = ''
  constructor(
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
  }
  private geterror() {
    this.toster.error('Check Your Network Connect Or Server Error')
    this.logout()
  }
  private logout() {
    window.location.href = environmentProduct.TimberBillApp + '#/logout'
  }
}
