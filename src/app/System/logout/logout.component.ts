import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/_services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toster:ToastrService
  ) { }

  ngOnInit(): void {
    this.logout()
  }
  logout() {
    this.authService.logout();
    this.toster.success('Logout SuccessFully')
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
