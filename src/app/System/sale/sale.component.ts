import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxPrintElementService } from 'ngx-print-element';
import { ToastrService } from 'ngx-toastr';
import { first, from } from 'rxjs';
import { customer } from 'src/app/Model/customer';
import { item } from 'src/app/Model/item';
import { Print, Sale, SaleEntry, SaleItem } from 'src/app/Model/sale';
import { state } from 'src/app/Model/state';
import { AmountToWordPipe } from 'src/app/Shared/pipe/amount-in-words.pipe';
import { PrintComponent } from 'src/app/Shared/print/print.component';
import { CustomerService } from 'src/app/Shared/_services/customer.service';
import { ItemService } from 'src/app/Shared/_services/item.service';
import { MessageService } from 'src/app/Shared/_services/message.service';
import { SaleService } from 'src/app/Shared/_services/sale.service';
import { StateService } from 'src/app/Shared/_services/state.service';
import { TokenStorageService } from 'src/app/Shared/_services/token-storage.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Profile } from 'src/app/Model/profile';
import { ProfileService } from 'src/app/Shared/_services/profile.service';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent {
  formSale: Sale = {
    id: 0,
    date: '',
    name: '',
    address: '',
    state: '',
    vehicalno: '',
    session: '',
    amount_in_word: '',
    gsttin_no: '',
    invoice_no: 0,
    state_code: '',
    total_amount: 0,
    total_rate_value: 0,
    type: '',
    userid: 0,
    total_tax_value: 0,
    financeby: '',
    financedownpayment: 0,
  };
  formSaleItem: SaleItem = {
    id: null,
    cgst_per: 0,
    gst_tax_value: 0,
    hsn_code: '',
    igst_per: 0,
    item: '',
    model_no: '',
    quantity: 1,
    rate: 0,
    sgst_per: 0,
    sl_no_and_emie_no: '',
    item_amount: 0,
    sl_no: 0,
  };
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
  loadingPrint = false;
  fakeArray = new Array(5);
  loading = true;
  isUpdate: boolean = false;
  isMantainStoke: boolean = false;
  isFinance: boolean = false;
  disable: boolean = true;
  billDisable: boolean = false;
  saleItemList: SaleItem[];
  customerList: Array<customer> = [];
  itemList: Array<item> = [];
  saleEntryList: Array<SaleEntry> = [];
  stateList: Array<state> = [];
  sessionOption: string[] = [
    '2022-2023',
    '2023-2024',
    '2024-2025',
    '2025-2026',
    '2026-2027',
    '2027-2028',
    '2028-2029',
    '2029-2030',
    '2030-2031',
    '2031-2031',
  ];
  private saleItemToDelete: SaleItem;
  private pipe = new DatePipe('en-US');
  private now = Date.now();
  private mySimpleFormat = this.pipe.transform(this.now, 'yyyy-MM-dd');
  private currentDate: Date = new Date();

  constructor(
    private toster: ToastrService,
    private router: Router,
    private item: ItemService,
    private sale: SaleService,
    private customer: CustomerService,
    private state: StateService,
    private message: MessageService,
    public dialog: MatDialog,
    private tokenstorage: TokenStorageService,
    private profile: ProfileService
  ) {}

  ngOnInit(): void {
    this.getStateApi(); // static values
    this.getCustomerApi(); // static values
    this.start(); // dinamic value
  }

  // programe Start function
  private start() {
    this.loading = true;
    this.setInitilationData();
  }

  // initilaized all data
  private setInitilationData() {
    this.isUpdate = false;
    this.isMantainStoke = false;
    this.isFinance = false;
    this.saleItemList = [];
    this.formSaleItem.item = '';
    this.formSale.date = this.mySimpleFormat;
    this.formSale.total_amount = 0;
    this.formSale.amount_in_word = '';
    this.formSale.total_rate_value = 0;
    this.formSale.total_tax_value = 0;
    this.formSale.type = 'NONE_GST';
    this.formSale.vehicalno = '';
    this.formSale.state = 'Jharkhand ';
    this.formSale.state_code = 'JH/20';
    this.formSale.state = 'Jharkhand ';
    this.formSale.state_code = 'JH/20';
    this.formSale.name = '';
    this.formSale.address = '';
    this.formSale.gsttin_no = '';
    if (this.isFinance) {
      this.formSale.financeby = 'HDFC BANK PVT';
    } else {
      this.formSale.financeby = '';
    }
    this.formSale.financedownpayment = 0;
    this.formSale.userid = this.tokenstorage.getUser().id;
    this.formSale.session = this.getbillsession(this.currentDate);
    this.setEmptySaleItem();
    this.getItemApi();
    this.getprofileApi();
  }

  stateNameSyn() {
    let changesStateCode: state[] = this.stateList.filter(
      (item: state) => item.statename === this.formSale.state
    );
    if (changesStateCode.length != 0) {
      this.formSale.state_code = changesStateCode[0].statecode;
    } else {
      console.log('No State Name Found');
    }
  }
  stateCodeSyn() {
    let changesStateName: state[] = this.stateList.filter(
      (item: state) => item.statecode === this.formSale.state_code
    );
    if (changesStateName.length != 0) {
      this.formSale.state = changesStateName[0].statename;
    } else {
      console.log('No State Name Found');
    }
  }

  // click to save new sale
  SaveSale() {
    let saleEntry: SaleEntry = {
      sale: this.formSale,
      saleitem: this.saleItemList,
    };
    this.AddSaleApi(saleEntry);
  }

  // click to update sale data
  UpdateSale() {
    let saleUpdate: SaleEntry = {
      sale: this.formSale,
      saleitem: this.saleItemList,
    };
    this.updateSaleApi(saleUpdate);
  }

  // make a new sale entry
  NewSaleEntry() {
    this.start();
  }

  //print sale
  PrintSale() {
    let checkSaleEntryList: SaleEntry[] = this.saleEntryList.filter(
      (item: SaleEntry) => item.sale.invoice_no == this.formSale.invoice_no
    );
    if (checkSaleEntryList.length != 0) {
      let saleEntryPrint: SaleEntry = checkSaleEntryList[0];
      if (this.isFinance) {
        // this.openDialog(saleEntryPrint, 'finance')
        this.loading = false;
        let print: Print = {
          saleData: saleEntryPrint,
          type: 'finance',
          profile: this.FormProfile,
        };
        this.message.setmessage(JSON.stringify(print));
        this.router.navigate(['/print']);
      } else {
        // this.openDialog(saleEntryPrint, 'main')
        this.loading = false;
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
  private openDialog(saleData: SaleEntry, type: string): void {
    const dialogRef = this.dialog.open(PrintComponent, {
      data: { saleData, type },
    });
  }

  //set sale data in ui to make changes
  setDataForUpdate() {
    this.saleItemList = [];
    if (this.isUpdate == true) {
      this.loading = true;
      this.getSaleApi(true);
      let SaleData: SaleEntry = this.findsaleEntry(
        this.formSale.invoice_no,
        this.saleEntryList,
        this.formSale.session
      );

      if (this.ValidatorChecker(SaleData)) {
        this.formSale = SaleData.sale;
        let updateDate: Date = new Date(this.formSale.date);
        this.formSale.date = this.pipe.transform(updateDate, 'yyyy-MM-dd');
        this.saleItemList = SaleData.saleitem;
        this.loading = false;
      } else {
        console.log('Sale Data Invalid');
      }
    } else {
      this.NewSaleEntry();
    }
  }

  //find SaleEntry for set update
  private findsaleEntry(
    invoice_no: number,
    saleEntryList: SaleEntry[],
    session: string
  ): SaleEntry {
    let result: SaleEntry = null;
    if (saleEntryList.length != 0) {
      // console.log(saleEntryList)
      let checkList: SaleEntry[] = saleEntryList.filter(
        (saleEntry: SaleEntry) =>
          Number(saleEntry.sale.invoice_no) === Number(invoice_no) &&
          saleEntry.sale.session == session
      );
      // console.log(checkList)
      if (checkList.length != 0) {
        result = checkList[0];
      } else {
        this.toster.error('No Sale Found By Given Invoice No. Please Retry');
        this.loading = false;
      }
    } else {
      console.log('Sale Entry List Is Empty');
    }

    return result;
  }

  //click to add sale Item
  addSaleItem() {
    if (
      !this.ValidatorChecker(this.formSaleItem.item) ||
      !this.ValidatorChecker(this.formSaleItem.item_amount) ||
      this.formSaleItem.item_amount == 0
    ) {
      this.toster.error('Please Enter All Item Details');
    } else {
      if (
        this.gstPerValidator(
          this.formSaleItem.cgst_per,
          this.formSaleItem.sgst_per,
          this.formSaleItem.igst_per
        )
      ) {
        let gstPerSum =
          Number(this.formSaleItem.cgst_per) +
          Number(this.formSaleItem.sgst_per) +
          Number(this.formSaleItem.igst_per);
        let saleItem: SaleItem = {
          id: this.formSaleItem.id,
          item: this.formSaleItem.item,
          hsn_code: this.formSaleItem.hsn_code,
          quantity: this.formSaleItem.quantity,
          model_no: this.formSaleItem.model_no,
          sl_no_and_emie_no: this.formSaleItem.sl_no_and_emie_no,
          rate: this.rateCalculator(
            gstPerSum,
            this.formSaleItem.item_amount,
            this.formSaleItem.quantity
          ),
          item_amount: this.formSaleItem.item_amount,
          cgst_per: this.formSaleItem.cgst_per,
          sgst_per: this.formSaleItem.sgst_per,
          igst_per: this.formSaleItem.igst_per,
          gst_tax_value: parseFloat(
            Number(
              (this.rateCalculator(
                gstPerSum,
                this.formSaleItem.item_amount,
                this.formSaleItem.quantity
              ) *
                gstPerSum) /
                100
            ).toFixed(3)
          ),
          sl_no: 0,
        };

        if (!this.validateSaleCustomerDetails()) {
          this.toster.error('Please Fill All the Above Details');
        } else {
          let checksaleItem = this.saleItemList.filter(
            (item: SaleItem) => item.item == this.formSaleItem.item
          );
          if (checksaleItem.length == 0) {
            this.saleItemList.push(saleItem);
            this.SetFinalAmountDetails();
          } else {
            let index = this.saleItemList.indexOf(checksaleItem[0]);
            this.saleItemList[index] = saleItem;
            this.SetFinalAmountDetails();
          }
        }
      } else {
        this.toster.error('Gst % not Valid');
      }
    }
  }

  // rate calculator By amount
  private rateCalculator(gstPer: number, amount: number, qty: number): number {
    let result: number = 0;
    result = parseFloat(
      ((Number(amount) * 100) / (Number(gstPer) + 100) / qty).toFixed(3)
    );
    return result;
  }

  // gst % validator
  private gstPerValidator(cgst: number, sgst: number, igst: number): boolean {
    let result: boolean = false;

    if (cgst != 0 && sgst != 0 && igst != 0) {
      result = false;
    } else if (igst != 0 && cgst != 0) {
      result = false;
    } else if (igst != 0 && sgst != 0) {
      result = false;
    } else {
      result = true;
    }
    return result;
  }

  //calculate the final amount  at add sale item
  private finalCalcuationSale(obj: SaleItem[]) {
    this.formSale.total_amount = 0;
    this.formSale.total_rate_value = 0;
    this.formSale.total_tax_value = 0;
    obj.map((saleItem: SaleItem) => {
      this.formSale.total_amount = parseFloat(
        (
          Number(this.formSale.total_amount) + Number(saleItem.item_amount)
        ).toFixed(3)
      );
      this.formSale.total_rate_value = parseFloat(
        (
          Number(this.formSale.total_rate_value) + Number(saleItem.rate)
        ).toFixed(3)
      );
      this.formSale.total_tax_value = parseFloat(
        (
          Number(this.formSale.total_tax_value) + Number(saleItem.gst_tax_value)
        ).toFixed(3)
      );
      this.formSale.amount_in_word = new AmountToWordPipe().transform(
        this.formSale.total_amount
      );
    });
  }

  //set empty if textbox sale item at add sale item
  private setEmptySaleItem() {
    this.formSaleItem.id = null;
    this.formSaleItem.item = '';
    this.formSaleItem.hsn_code = '';
    this.formSaleItem.model_no = '';
    this.formSaleItem.sl_no_and_emie_no = '';
    this.formSaleItem.quantity = 1;
    this.formSaleItem.rate = 0;
    this.formSaleItem.cgst_per = 9;
    this.formSaleItem.sgst_per = 9;
    this.formSaleItem.igst_per = 0;
    this.formSaleItem.item_amount = 0;
  }

  // set data to text box function at add sale item
  private SetFinalAmountDetails() {
    if (this.saleItemList.length != 0) {
      this.finalCalcuationSale(this.saleItemList);
      this.setEmptySaleItem();
    } else {
      this.toster.error('Item not found');
    }
  }

  // check validation for customer details at add sale item
  private validateSaleCustomerDetails(): boolean {
    if (
      !this.ValidatorChecker(this.formSale.invoice_no) ||
      !this.ValidatorChecker(this.formSale.date) ||
      !this.ValidatorChecker(this.formSale.name) ||
      !this.ValidatorChecker(this.formSale.address) ||
      !this.ValidatorChecker(this.formSale.state) ||
      !this.ValidatorChecker(this.formSale.state_code)
    ) {
      return false;
    } else {
      return true;
    }
  }

  // edit option in sale item to make changes
  update(obj: SaleItem) {
    this.setSaleItem(obj);
  }
  // select update check box for update sale data
  forUpdate($event: any) {
    const isChecked = $event.target.checked;
    if (isChecked === true) {
      this.isUpdate = true;
    } else if (isChecked === false) {
      this.isUpdate = false;
      this.NewSaleEntry();
    }
  }

  //set data to text box after clicking update
  private setSaleItem(obj: SaleItem) {
    this.formSaleItem.id = obj.id;
    this.formSaleItem.hsn_code = obj.hsn_code;
    this.formSaleItem.item = obj.item;
    this.formSaleItem.model_no = obj.model_no;
    this.formSaleItem.quantity = obj.quantity;
    this.formSaleItem.cgst_per = obj.cgst_per;
    this.formSaleItem.sgst_per = obj.sgst_per;
    this.formSaleItem.igst_per = obj.igst_per;
    this.formSaleItem.rate = obj.rate;
    this.formSaleItem.sl_no_and_emie_no = obj.sl_no_and_emie_no;
    this.formSaleItem.item_amount = obj.item_amount;
  }

  // select to mantain stoke
  forMantainStoke($event: any) {
    const isChecked = $event.target.checked;
    if (isChecked === true) {
      this.isMantainStoke = true;
    } else if (isChecked === false) {
      this.isMantainStoke = false;
    }
  }
  // select to Finacne
  forFinance($event: any) {
    const isChecked = $event.target.checked;
    if (isChecked === true) {
      this.isFinance = true;
      this.formSale.financeby = 'HDFC BANK PVT';
    } else if (isChecked === false) {
      this.isFinance = false;
      this.formSale.financeby = '';
    }
  }
  // delete conformation for yes
  assignToDelete(obj: SaleItem) {
    this.saleItemToDelete = obj;
  }

  //delete conformation for no
  deleteNo() {
    let ref = document.getElementById('cancelDelete');
    ref.click();
  }
  //delete conformation for yes
  deleteYes() {
    this.saleItemList = this.saleItemList.filter(
      (item: SaleItem) => item != this.saleItemToDelete
    );
    let ref = document.getElementById('cancelDelete');
    if (ref === null) {
      // console.log("null")
    } else {
      ref.click();
      this.SetFinalAmountDetails();
    }
  }

  // dinamic filter function
  myFilterFunction(value: any) {
    // console.log(value)
    let filter = value.toUpperCase();
    let mytable = document.getElementById('excel-table-1');
    let tr = mytable.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td')[0];
      let td1 = tr[i].getElementsByTagName('td')[1];
      let td2 = tr[i].getElementsByTagName('td')[2];
      if (td) {
        let textvalue = td.textContent || td.innerHTML;
        let textvalue1 = td1.textContent || td1.innerHTML;
        let textvalue2 = td2.textContent || td2.innerHTML;
        if (
          textvalue.toUpperCase().indexOf(filter) > -1 ||
          textvalue1.toUpperCase().indexOf(filter) > -1 ||
          textvalue2.toUpperCase().indexOf(filter) > -1
        ) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }

  // assign customer details to sale text box
  assignToTextBox(obj: customer) {
    this.formSale.name = obj.name;
    this.formSale.address = obj.address;
    this.formSale.gsttin_no = obj.gst;
    let ref = document.getElementById('cancelCustomer');
    ref.click();
  }

  //add customer
  addcustomer() {
    let obj: customer = {
      address: this.formSale.address,
      gst: this.formSale.gsttin_no,
      id: 0,
      name: this.formSale.name,
      userid: this.formSale.userid,
    };
    if (obj.name != '' && obj.address != '' && obj.userid != 0) {
      this.addCustomerApi(obj);
    } else {
      this.toster.error('Empty Customer Details');
    }
  }
  // function that return the session accourding to date
  private getbillsession(date: Date): string {
    let month: number = date.getMonth() + 1;
    let year: number = date.getFullYear();
    let result: string = null;
    if (month >= 4 && month <= 12) {
      result = year + '-' + (year + 1);
    } else if (month >= 1 && month <= 3) {
      result = year - 1 + '-' + year;
    } else {
      console.log('error in month session');
    }
    return result;
  }

  //error
  private geterror() {
    this.toster.error('Check Your Network Connect Or Server Error');
    this.logout();
  }

  //logout
  private logout() {
    this.router.navigate(['/logout']);
  }

  //validator for undefine empty null data
  private ValidatorChecker(data: any) {
    if (
      typeof data === 'undefined' ||
      data === null ||
      data.toString() === '' ||
      Number.isNaN(data) ||
      data.toString() == 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  //state api
  private getStateApi() {
    this.state
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.stateList = data.data;
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

  //customer api
  private getCustomerApi() {
    this.customer
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.customerList = data.data;
            this.loading = false;
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
  private addCustomerApi(obj: customer) {
    this.customer
      .post(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.getCustomerApi();
            this.loading = false;
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

  //Item api
  private getItemApi() {
    this.item
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.itemList = data.data;
            this.getSaleApi(true);
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

  // sale api
  private getSaleApi(reload: boolean) {
    this.sale
      .get()
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            if (reload) {
              this.saleEntryList = data.data;
              if (this.saleEntryList.length != 0) {
                let lastBillsession =
                  this.saleEntryList[this.saleEntryList.length - 1].sale
                    .session;
                if (this.isUpdate == false) {
                  if (this.formSale.session === lastBillsession) {
                    this.formSale.invoice_no =
                      Number(
                        this.saleEntryList[this.saleEntryList.length - 1].sale
                          .invoice_no
                      ) + 1;
                  } else {
                    this.formSale.invoice_no = 1;
                  }
                }
              } else {
                this.formSale.invoice_no = 1;
              }
              this.loading = false;
            } else {
              console.log(data.data);
              this.saleEntryList = data.data;
              this.loading = false;
            }
          } else if (data.apiStatus.message === 'Sale not found') {
            this.formSale.invoice_no = 1;
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
  private AddSaleApi(obj: SaleEntry) {
    this.loading = true;
    this.sale
      .post(obj)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.saleEntryList = data.data;
            this.toster.success('SuccessFully');
            this.getSaleApi(false);
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
  private updateSaleApi(obj: SaleEntry) {
    this.loading = true;
    this.sale
      .update(obj.sale.id, obj)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.apiStatus.message === 'OK') {
            this.saleEntryList = data.data;
            this.toster.success('Update SuccessFully');
            this.getSaleApi(false);
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
