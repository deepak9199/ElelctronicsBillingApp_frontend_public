import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { customer } from 'src/app/Model/customer';
import { CustomerService } from 'src/app/Shared/_services/customer.service';
import { TokenStorageService } from 'src/app/Shared/_services/token-storage.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  formAdd: any = {}
  formEdit: any = {}
  loading = true
  customerList: Array<customer> = []
  customerToDelete: customer
  constructor(
    private toster: ToastrService,
    private router: Router,
    private customer: CustomerService,
    private tokenstorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.getCustomerApi()
  }
  myFunction(value: any) {
    // console.log(value)
    let filter = value.toUpperCase()
    let mytable = document.getElementById('excel-table')
    let tr = mytable.getElementsByTagName('tr')
    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td')[0]
      let td1 = tr[i].getElementsByTagName('td')[1]
      let td2 = tr[i].getElementsByTagName('td')[2]
      let td3 = tr[i].getElementsByTagName('td')[3]
      if (td) {
        let textvalue = td.textContent || td.innerHTML
        let textvalue1 = td1.textContent || td1.innerHTML
        let textvalue2 = td2.textContent || td2.innerHTML
        let textvalue3 = td3.textContent || td3.innerHTML
        if (textvalue.toUpperCase().indexOf(filter) > -1 || textvalue1.toUpperCase().indexOf(filter) > -1 || textvalue2.toUpperCase().indexOf(filter) > -1 || textvalue3.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = ""
        }
        else {
          tr[i].style.display = "none"
        }
      }
    }
  }
  update(obj: customer) {
    this.formEdit.id = obj.id
    this.formEdit.name = obj.name
    this.formEdit.gst = obj.gst
    this.formEdit.address = obj.address
  }
  setEmpty() {
    this.ngOnInit()
    this.formAdd.name = ''
    this.formAdd.address = ''
    this.formAdd.gst = ''
  }
  assignToDelete(obj: customer) {
    this.customerToDelete = obj;
  }
  addcustomer() {
    this.formAdd.userid = this.tokenstorage.getUser().id
    let customer: customer = this.formAdd
    this.addCustomerApi(customer)
  }
  updateCustomer() {
    this.formEdit.userid = this.tokenstorage.getUser().id
    let customer: customer = this.formEdit
    this.updateCustomerApi(customer)
  }
  deleteNo() {
    let ref = document.getElementById('cancelDelete')
    ref.click(),
      this.ngOnInit()
  }
  deleteYes() {
    this.deleteCustomerApi(this.customerToDelete)
  }
  private geterror() {
    this.toster.error('Check Your Network Connect Or Server Error')
    this.logout()
  }
  private logout() {
    this.router.navigate(['/logout'])
  }
  private ValidatorChecker(data: any) {

    if (typeof data === "undefined" || data === null) {
      return false
    }
    else {
      return true
    }
  }
  private updateCustomerApi(obj: customer) {
    this.customer.update(obj.id, obj).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.setEmpty()
          let ref = document.getElementById('cancelEdit')
          if (ref === null) {
            // console.log("null")
          }
          else {
            ref.click(),
              this.toster.success("Customer Added Successfully")

          }
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          // this.logout()
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
  private deleteCustomerApi(obj: customer) {
    this.customer.delete(obj.id).pipe(first())
      .subscribe(
        data => {
          if (data.apiStatus.message === 'OK') {
            this.ngOnInit()
            let ref = document.getElementById('cancelDelete')
            if (ref === null) {
              // console.log("null")
            }
            else {
              ref.click(),
                this.toster.success("Customer Added Successfully")

            }
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
  private addCustomerApi(obj: customer) {
    this.customer.post(obj).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.setEmpty()
          let ref = document.getElementById('cancelAdd')
          if (ref === null) {
            // console.log("null")
          }
          else {
            ref.click(),
              this.toster.success("Customer Added Successfully")

          }
        }
        else if (data.apiStatus.message === 'Access is denied') {
          this.toster.error('Session Token Is Expired You Have To Re-Login')
          // console.log(data.apiStatus.message)
          // this.logout()
        }
        else if (data.apiStatus.message === 'data already present') {
          this.toster.error(data.apiStatus.message)
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
  private getCustomerApi() {
    this.customer.get().pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.customerList = data.data;
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
}
