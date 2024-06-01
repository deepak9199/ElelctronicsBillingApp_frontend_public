import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { item } from 'src/app/Model/item';
import { ItemService } from 'src/app/Shared/_services/item.service';
import { TokenStorageService } from 'src/app/Shared/_services/token-storage.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  formAdd: any = {}
  formEdit: any = {}
  loading = true
  itemList: Array<item> = []
  itemToDelete: item
  constructor(
    private toster: ToastrService,
    private router: Router,
    private item: ItemService,
    private tokenstorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.getItemApi()
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
      if (td) {
        let textvalue = td.textContent || td.innerHTML
        let textvalue1 = td1.textContent || td1.innerHTML
        let textvalue2 = td2.textContent || td2.innerHTML
        if (textvalue.toUpperCase().indexOf(filter) > -1 || textvalue1.toUpperCase().indexOf(filter) > -1 || textvalue2.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = ""
        }
        else {
          tr[i].style.display = "none"
        }
      }
    }
  }
  update(obj: item) {
    this.formEdit.id = obj.id
    this.formEdit.name = obj.name
  }
  setEmpty() {
    this.ngOnInit()
    this.formAdd.name = ''
  }
  assignToDelete(obj: item) {
    this.itemToDelete = obj;
  }
  addItem() {
    this.formAdd.userid = this.tokenstorage.getUser().id
    let item: item = this.formAdd
    this.addItemApi(item)
  }
  updateItem() {
    this.formEdit.userid = this.tokenstorage.getUser().id
    let item: item = this.formEdit
    this.updateItemApi(item)
  }
  deleteNo() {
    let ref = document.getElementById('cancelDelete')
    ref.click(),
      this.ngOnInit()
  }
  deleteYes() {
    this.deleteItemApi(this.itemToDelete)
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
  private updateItemApi(obj: item) {
    this.item.update(obj.id, obj).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.setEmpty()
          let ref = document.getElementById('cancelEdit')
          if (ref === null) {
            // console.log("null")
          }
          else {
            ref.click(),
              this.toster.success("Item Added Successfully")

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
  private deleteItemApi(obj: item) {
    this.item.delete(obj.id).pipe(first())
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
                this.toster.success("Item Added Successfully")

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
  private addItemApi(obj: item) {
    this.item.post(obj).pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.setEmpty()
          let ref = document.getElementById('cancelAdd')
          if (ref === null) {
            // console.log("null")
          }
          else {
            ref.click(),
              this.toster.success("Item Added Successfully")

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
  private getItemApi() {
    this.item.get().pipe(first()).subscribe(
      data => {
        if (data.apiStatus.message === 'OK') {
          this.itemList = data.data;
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
        // this.geterror()
        console.log(err.error)
      }
    )
  }
}
