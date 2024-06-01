import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Profile } from 'src/app/Model/profile';
import { Print, SaleEntry } from 'src/app/Model/sale';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {
  loadingPrint = false
  billdate: string
  pipe = new DatePipe('en-US');
  data: Print = {
    saleData: null,
    type: '',
    profile: null
  }
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: { saleData: SaleEntry, type: string },
    private toster: ToastrService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    if (this.message.getmessage() != '') {
      let obj = JSON.parse(this.message.getmessage())
      this.data = obj
      this.billdate = this.pipe.transform(this.data.saleData.sale.date, 'dd-MM-yyyy');
    }
    else {
      this.toster.error('No Data Found')
    }

  }
  //print
  captureScreen(id: any) {
    const data = document.getElementById(id);
    html2canvas(data, { scale: 3 }).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = pdf.internal.pageSize.getWidth();;
      const pageHeight = pdf.internal.pageSize.getHeight();
      // const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgHeight = pdf.internal.pageSize.getHeight();
      const heightLeft = imgHeight;
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      // pdf.save('invoice.pdf');
      return pdf
    }).then((pdf) => {
      this.loadingPrint = false
      window.open(pdf.output('bloburl'), '_blank');
    });
  }
  print() {
    this.loadingPrint = true
    if (this.loadingPrint == true) {
      console.log('print')
      this.captureScreen('MyDIv')
    }
    else {
      this.toster.error('loading Symbole error')
    }
  }

  checkBillType(type: string, printModule: string): boolean {
    let result: boolean = true
    switch (type) {
      case ('main'): {
        if (printModule === type) {
          result = false
        }
        break;
      }
      case ('main_gst'): {
        if (printModule === type) {
          result = false
        }
        break;
      }
      case ('finance'): {
        if (printModule === type) {
          result = false
        }
        break;
      }
      case ('finance_gst'): {
        if (printModule === type) {
          result = false
        }
        break;
      }
      default: {
        result = true
      }
    }
    return result
  }
}
