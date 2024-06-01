import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../_services/auth.service";


import { TokenStorageService } from "../_services/token-storage.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private token: TokenStorageService,
    private authService: AuthService,
    private toster: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.token.getToken() != null) {
      const roles = next.data['role'] as Array<string>;
      if (roles) {
        const match = this.token.getUser().roles[0]
        // console.log(match + ' ' + roles)
        if (match == roles) {
          return true;
        } else {
          // tslint:disable-next-line: quotemark
          this.toster.error("unauthorise routing session logout");
          this.router.navigate(['/logout']);
          this.logout()
          return false;
        }
      } else {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    })
  }
}

