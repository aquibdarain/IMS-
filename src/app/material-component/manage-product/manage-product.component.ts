import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns:string[]=['name','categoryName','description','price','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(private productService:ProductService,
    private spinner: NgxSpinnerService,
    private dialog:MatDialog,
    private snackbarService: SnackbarService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.tableData();
  }

  tableData(){
    this.productService.getProduct().subscribe((response:any)=>{
      this.spinner.hide();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.spinner.hide();
      console.log(error);
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

   handleAddAction(){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.data ={
     action: 'Add',
   }
   dialogConfig.width = "850px";
   const dialogRef = this.dialog.open(ProductComponent,dialogConfig)
   this.router.events.subscribe(()=>{
   dialogRef.close();
   });
   const sub =dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
     this.tableData();
   })
 }


   handleEditAction(values:any){
     const dialogConfig = new MatDialogConfig();
     dialogConfig.data ={
       action: 'Edit',
       data:values
     }
     dialogConfig.width = "850px";
     const dialogRef = this.dialog.open(ProductComponent,dialogConfig)
     this.router.events.subscribe(()=>{
     dialogRef.close();
     });
     const sub =dialogRef.componentInstance.onEditCategory.subscribe((response: any)=>{
       this.tableData();
     })
   }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:'delete'+ values.name+'product'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmiStatusChange.subscribe((response)=>{
      this.spinner.show();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

deleteProduct(id:any){
this.productService.delete(id).subscribe((response:any)=>{
  this.spinner.hide();
  this.tableData();
  this.responseMessage = response?.message;
  this.snackbarService.openSnackBar(this.responseMessage,"success")
},(error:any)=>{
  this.spinner.hide();
  console.log(error);
  if(error.error?.message){
    this.responseMessage = error.error?.message;
}
else{
  this.responseMessage = GlobalConstants.genericError;
}
this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
})
}


  onChange(status:any,id:any){
   var data = {
    status:status.toString(),
    id:id
   }
   this.productService.updateStatus(data).subscribe((response:any)=>{
  this.spinner.hide();
  this.responseMessage = response?.message;
this.snackbarService.openSnackBar(this.responseMessage,"success");
   },(error:any)=>{
    this.spinner.hide();
  console.log(error);
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


