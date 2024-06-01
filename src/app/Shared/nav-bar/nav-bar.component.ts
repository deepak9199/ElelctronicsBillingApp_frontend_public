import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  roles = ''
  username = ''
  binaryImage: any;
  firstName = ''
  middleName = ''
  lastName = ''
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    
  }
  logout() {
    this.router.navigate(['/logout'])
  }
  public reload() {
    window.location.reload();
  }
}
