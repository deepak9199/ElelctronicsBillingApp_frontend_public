import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultPageComponent } from './Shared/default-page/default-page.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { LoadingComponent } from './Shared/loading/loading.component';
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component';
import { PrintComponent } from './Shared/print/print.component';
import { SideBarComponent } from './Shared/side-bar/side-bar.component';
import { CustomerComponent } from './System/customer/customer.component';
import { LoginComponent } from './System/login/login.component';
import { LogoutComponent } from './System/logout/logout.component';
import { SaleComponent } from './System/sale/sale.component';
import { ItemComponent } from './System/item/item.component';
import { ReportComponent } from './System/report/report.component';
import { CoreModule } from './core/core.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthGuard } from './Shared/_guards/guard';
import { authInterceptorProviders } from './Shared/_helpers/helpers';
import { AuthService } from './Shared/_services/auth.service';
import { ProfileComponent } from './System/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultPageComponent,
    FooterComponent,
    LoadingComponent,
    NavBarComponent,
    PrintComponent,
    SideBarComponent,
    CustomerComponent,
    LoginComponent,
    LogoutComponent,
    SaleComponent,
    ItemComponent,
    ReportComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,

  ],
  providers: [
    authInterceptorProviders,
    AuthGuard,
    AuthService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
