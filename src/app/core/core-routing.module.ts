import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPageComponent } from '../Shared/default-page/default-page.component';
import { PrintComponent } from '../Shared/print/print.component';
import { AuthGuard } from '../Shared/_guards/guard';
import { CustomerComponent } from '../System/customer/customer.component';
import { ItemComponent } from '../System/item/item.component';
import { LoginComponent } from '../System/login/login.component';
import { LogoutComponent } from '../System/logout/logout.component';
import { ProfileComponent } from '../System/profile/profile.component';
import { ReportComponent } from '../System/report/report.component';
import { SaleComponent } from '../System/sale/sale.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', component: LoginComponent },
  {
    path: 'sale', component: SaleComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },
  {
    path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },
  {
    path: 'item', component: ItemComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },
  {
    path: 'print', component: PrintComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },
  {
    path: 'report', component: ReportComponent, canActivate: [AuthGuard], data:
    {
      role: 'ROLE_ADMIN',
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
