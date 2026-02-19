import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';
import { IVentaDto } from 'src/app/models/external/order/venta-dto';

@Component({
  selector: 'app-post-void-invoice',
  templateUrl: './post-void-invoice.component.html',
  styleUrls: ['./post-void-invoice.component.css']
})
export class PostVoidInvoiceComponent implements OnInit {

  constructor(public modal: NgbActiveModal) { }

  venta: IVentaDto;
  orden: OrderListItemDto;

  ngOnInit() {
  }


  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  }

  setData(orden: OrderListItemDto, venta: IVentaDto) {
    this.orden = orden;
    this.venta = venta;
  }

  imprimir() {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');
    mywindow.document.write('<html><head>');
    mywindow.document.write(`${linksHtml}${stylesHtml}${`
     <style>
     @page {
      size: 7.5cm 15cm;
      margin: 0;
  }
    </style>`
      }`);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById("imprimible").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(() => {
      mywindow.print();
      //mywindow.close();
    }, 800);

    return true;
  }
}
