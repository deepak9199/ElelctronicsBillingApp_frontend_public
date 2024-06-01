import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { MessageService } from 'src/app/Shared/_services/message.service';
import { SaleService } from 'src/app/Shared/_services/sale.service';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Print, Sale, SaleEntry } from 'src/app/Model/sale';
import { SaleReport } from 'src/app/Model/saleReport';
import { ReportService } from 'src/app/Shared/_services/report.service';
import { Profile } from 'src/app/Model/profile';
import { ProfileService } from 'src/app/Shared/_services/profile.service';
import { Delete } from 'src/app/Model/delete';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  saleList: Array<SaleReport> = [];
  GolblesaleList: Array<SaleReport> = [];
  saledata: Sale;
  loading = true;
  isbyname: boolean = false;
  isday: boolean = false;
  day: number = 0;
  ismonth: boolean = false;
  month: number = 0;
  isyear: boolean = false;
  year: number = 0;
  searchOption: string = '';
  deletedataobj: number = 0;
  private saleEntryList: Array<SaleEntry> = [];
  private FormProfile: Profile = {
    id: 0,
    userid: 0,
    companyname: '',
    gstno: '',
    statecode: '',
    mobileno: '',
    addressheading: '',
    addresstitle: '',
    passcode: '',
    email: '',
  };
  searchOptionList: string[] = [
    'All',
    'By Name',
    'By Day',
    'By Month',
    'By Year',
  ];
  dayList: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [
    2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  ];
  constructor(
    private sale: SaleService,
    private report: ReportService,
    private toster: ToastrService,
    private router: Router,
    private message: MessageService,
    public dialog: MatDialog,
    private profile: ProfileService
  ) {}

  ngOnInit(): void {
    this.getSaleApi();
    this.getprofileApi();
  }
  // initilization
  startSearch() {
    this.searchbychooice(this.searchOption);
  }
  // search option
  searchbychooice(data: string) {
    this.saleList = [];
    if (data === '') {
      this.isbyname = false;
      this.isday = false;
      this.ismonth = false;
      this.isyear = false;
      this.loading = false;
    } else if (data === 'All') {
      this.saleList = this.GolblesaleList;
      this.isbyname = false;
      this.isday = false;
      this.ismonth = false;
      this.isyear = false;
    } else if (data === 'By Name') {
      this.saleList = this.GolblesaleList;
      this.isbyname = true;
      this.isday = false;
      this.ismonth = false;
      this.isyear = false;
    } else if (data === 'By Day') {
      this.search();
      this.isbyname = false;
      this.isday = true;
      this.ismonth = true;
      this.isyear = true;
    } else if (data === 'By Month') {
      this.search();
      this.isbyname = false;
      this.isday = false;
      this.day = 0;
      this.ismonth = true;
      this.isyear = true;
    } else if (data === 'By Year') {
      this.search();
      this.isbyname = false;
      this.isday = false;
      this.day = 0;
      this.ismonth = false;
      this.month = 0;
      this.isyear = true;
    } else {
      this.toster.error('Selected Chooise Not Valid');
    }
  }
  //search fucntion by given date data
  search() {
    if (this.searchOption != 'All') {
      if (
        this.ValidatorChecker(this.day) &&
        this.ValidatorChecker(this.month) &&
        this.ValidatorChecker(this.year)
      ) {
        let DayInMonth: number = new Date(this.year, this.month, 0).getDate();
        let date: string = this.month + '/' + this.day + '/' + this.year;
        let startdate: Date = new Date(date);
        // console.log("by day")
        this.getTimeClockUserByDateRange(startdate, startdate);
      } else if (
        this.ValidatorChecker(this.month) &&
        this.ValidatorChecker(this.year)
      ) {
        let DayInMonth: number = new Date(this.year, this.month, 0).getDate();
        let start: string = this.month + '/01/' + '/' + this.year;
        let end: string = this.month + '/' + DayInMonth + '/' + this.year;
        let startdate: Date = new Date(start);
        let enddate: Date = new Date(end);
        // console.log('start date :' + startdate.toString() + ' end date : ' + enddate.toString())
        // console.log("by month")
        this.getTimeClockUserByDateRange(startdate, enddate);
      } else if (this.ValidatorChecker(this.year)) {
        let DayInMonth: number = new Date(this.year, 12, 0).getDate();
        let start: string = '01/01/' + this.year;
        let end: string = '12/' + DayInMonth + '/' + this.year;
        let startdate: Date = new Date(start);
        let enddate: Date = new Date(end);
        // console.log("by year")
        // console.log('start date :' + startdate.toString() + ' end date : ' + enddate.toString())
        this.getTimeClockUserByDateRange(startdate, enddate);
      } else {
        this.toster.error('Select Valid Date');
      }
    }
  }
  // function to download data in exsl format
  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    let date = new Date();
    let currentDate = moment(date).format('DDMMYYYY');
    let time = date.getTime();
    let currentTime = moment(time).format('HHMMSS');
    // console.log(currentTime)
    let fileName = 'Report_' + currentDate + '_' + currentTime + '.xlsx';
    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
  //filter finction
  myFunction(value: any) {
    // console.log(value)
    let filter = value.toUpperCase();
    let mytable = document.getElementById('excel-table');
    let tr = mytable.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td')[0];
      let td1 = tr[i].getElementsByTagName('td')[1];
      let td2 = tr[i].getElementsByTagName('td')[2];
      let td3 = tr[i].getElementsByTagName('td')[3];
      if (td) {
        let textvalue = td.textContent || td.innerHTML;
        let textvalue1 = td1.textContent || td1.innerHTML;
        let textvalue2 = td2.textContent || td2.innerHTML;
        let textvalue3 = td3.textContent || td3.innerHTML;
        if (
          textvalue.toUpperCase().indexOf(filter) > -1 ||
          textvalue1.toUpperCase().indexOf(filter) > -1 ||
          textvalue2.toUpperCase().indexOf(filter) > -1 ||
          textvalue3.toUpperCase().indexOf(filter) > -1
        ) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }
  //sale Report Api
  private getSaleReportApi() {
    this.report
      .getSale()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.GolblesaleList = data.data;
            if (this.GolblesaleList.length != 0) {
              this.startSearch();
            } else {
              this.toster.error('sale list not found globle');
              this.loading = false;
            }
          } else if (data.apiStatus.message === 'Access is denied') {
            this.toster.error('Session Token Is Expired You Have To Re-Login');
            // console.log(data.apiStatus.message)
            this.logout();
          } else {
            console.log(data.apiStatus.message);
          }
        },
        (err) => {
          this.geterror();
          // console.log(err.error)
        }
      );
  }
  //sale api for print bill
  private getSaleApi() {
    this.sale
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.saleEntryList = data.data;
            this.getSaleReportApi();
          } else if (data.apiStatus.message === 'Sale not found') {
            this.toster.error(data.apiStatus.message);
            this.loading = false;
          } else if (data.apiStatus.message === 'Access is denied') {
            this.toster.error('Session Token Is Expired You Have To Re-Login');
            // console.log(data.apiStatus.message)
            this.logout();
          } else {
            this.loading = false;
            this.toster.error(data.apiStatus.message);
          }
        },
        (err) => {
          this.geterror();
          console.log(err.error);
        }
      );
  }
  //error to catch error
  private geterror() {
    this.toster.error('Check Your Network Connect Or Server Error');
    this.logout();
  }
  //logout
  private logout() {
    this.router.navigate(['/logout']);
  }
  //set object to delete
  deletesaleobj(invoiceno: number) {
    this.deletedataobj = invoiceno;
  }
  // conform to delete
  deleteYes() {
    let ref = document.getElementById('cancelDelete');
    if (ref === null) {
      console.log('null');
    } else {
      ref.click();
      this.deleteSaleApi(this.deletedataobj);
    }
  }
  // conform not to delete
  deleteNo() {
    let ref = document.getElementById('cancelDelete');
    ref.click();
  }
  // find the data by data from Sale
  private getTimeClockUserByDateRange(startdateData: Date, enddateData: Date) {
    let startdate = moment(startdateData).format('yyyy-MM-DD');
    let enddate = moment(enddateData).format('yyyy-MM-DD');
    // console.log('start date: ' + startdate.toString() + ' end date : ' + enddate)
    if (this.ValidatorChecker(startdate) && this.ValidatorChecker(enddate)) {
      if (this.GolblesaleList.length != 0) {
        // console.log(this.GolblesaleList.length)
        this.saleList = this.GolblesaleList.filter(
          (item: any) =>
            moment(item.date).format('yyyy-MM-DD') >= startdate &&
            moment(item.date).format('yyyy-MM-DD') <= enddate
        );
        // console.log(this.saleList)
        this.loading = false;
      } else {
        console.log('error globle sale list');
      }
    } else {
      this.toster.error('Date no found');
    }
  }
  // data validator
  private ValidatorChecker(data: any) {
    if (
      typeof data === 'undefined' ||
      data === null ||
      data.toString() === '' ||
      Number.isNaN(data) ||
      data == 0
    ) {
      return false;
    } else {
      return true;
    }
  }
  //print sale
  PrintSale(invoiceNo: number) {
    console.log('Print');
    this.loading = true;
    let checkSaleEntryList: SaleEntry[] = this.saleEntryList.filter(
      (item: SaleEntry) => item.sale.invoice_no == invoiceNo
    );
    if (checkSaleEntryList.length != 0) {
      let saleEntryPrint: SaleEntry = checkSaleEntryList[0];

      if (this.ValidatorChecker(saleEntryPrint.sale.financeby)) {
        this.loading = false;
        let print: Print = {
          saleData: saleEntryPrint,
          type: 'finance',
          profile: this.FormProfile,
        };
        this.message.setmessage(JSON.stringify(print));
        // this.openDialog(saleEntryPrint, 'finance')
        this.router.navigate(['/print']);
      } else {
        this.loading = false;
        // this.openDialog(saleEntryPrint, 'main')
        let print: Print = {
          saleData: saleEntryPrint,
          type: 'main',
          profile: this.FormProfile,
        };
        this.message.setmessage(JSON.stringify(print));
        this.router.navigate(['/print']);
      }
    } else {
      this.toster.error('Sale not Found');
    }
  }
  // call dilog box function
  // private openDialog(saleData: SaleEntry, type: string): void {
  //   const dialogRef = this.dialog.open(PrintComponent, { data: { saleData, type } })
  // }

  // call dilog box function
  // private openDialog(saleData: SaleEntry, type: string): void {
  //   const dialogRef = this.dialog.open(PrintComponent, { data: { saleData, type } })
  // }

  //delete sale api
  private deleteSaleApi(billno: number) {
    console.log(billno);
    this.sale
      .delete(billno)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.ngOnInit();
            this.toster.success('Deleted Successfully');
          } else {
            console.log(data.apiStatus.message);
          }
        },
        (err) => {
          this.geterror();
          // console.log(err.error)
        }
      );
  }
  //profile api
  getprofileApi() {
    this.profile
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.FormProfile = data.data;
          } else if (data.apiStatus.message === 'Access is denied') {
            this.toster.error('Session Token Is Expired You Have To Re-Login');
            // console.log(data.apiStatus.message)
            this.logout();
          } else {
            this.FormProfile = {
              id: 0,
              userid: 0,
              companyname: 'Electronics Billing App',
              gstno: '',
              statecode: '',
              mobileno: '',
              addressheading: '',
              addresstitle: '',
              passcode: '',
              email: '',
            };
            console.log(data.apiStatus.message);
          }
        },
        (err) => {
          this.geterror();
          // console.log(err.error)
        }
      );
  }
}
