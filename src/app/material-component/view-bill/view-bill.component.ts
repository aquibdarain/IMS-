import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'paymentMethod',
    'total',
    'view',
  ];
  dataSource: any;
  responseMessage: any;

  constructor(
    private billService: BillService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.tableData();
  }

  tableData(){
    this.billService.getBills().subscribe((response:any)=>{
  this.spinner.hide();
  this.dataSource = new MatTableDataSource(response);
    },(error)=>{
      this.spinner.hide();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
}


applyFilter(event:Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
 }

 handleViewAction(values:any){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data ={
    data:values
  };
  dialogConfig.width = "100%";
  const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
  this.router.events.subscribe(()=>{
  dialogRef.close();
  });
}

downloadReportAction(values:any){
  this.spinner.show();
  var data = {
     name:values.name,
     email:values.email,
     uuid:values.uuid,
     contactNumber:values.contactNumber,
     paymentMethod:values.paymentMethod,
     totalAmount:values.total,
     productDetails:values.productDetails
  }
  this.billService.getPDF(data).subscribe((response)=>{
saveAs(response,values.uuid+'pdf')
this.spinner.hide();
})
}

handleDeleteAction(values:any){
const dialogConfig = new MatDialogConfig();
dialogConfig.data = {
  message: 'delete'+ values.name+'bill'
};
const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
const sub = dialogRef.componentInstance.onEmiStatusChange.subscribe((response)=>{
  this.spinner.show();
  this.deleteProduct(values.id);
  dialogRef.close();
  })
}

  deleteProduct(id: any) {
    this.billService.delete(id).subscribe((response:any)=>{
      this.spinner.show();
      this.tableData()
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success")
    },(error:any)=>{
      this.spinner.hide();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
}


