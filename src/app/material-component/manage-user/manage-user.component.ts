import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
displayedColumns:string[]=['name','email','contactNumber','status'];
dataSource:any;
responseMessage:any;

constructor(
  private spinner: NgxSpinnerService,
  private userService:UserService,
  private snackbarService: SnackbarService,
 ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.tableData();
  }

  tableData(){
this.userService.getUser().subscribe((response:any)=>{
  this.spinner.hide();
  this.dataSource = new MatTableDataSource(response);
},(error:any)=>{
  this.spinner.hide();
  if(error.error?.message){
    this.responseMessage = error.error?.message;
  }
  else{
    this.responseMessage =GlobalConstants.genericError;
  }
  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
})
  }

  applyFilter(event:Event){
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction( status:any,id:any){
   this.spinner.show();
   var data= {
    status:status.toString(),
    id:id
   }
   this.userService.update(data).subscribe((response:any)=>{
    this.spinner.hide();
    this.responseMessage = response?.message;
    this.snackbarService.openSnackBar(this.responseMessage,"Success")
   },(error:any)=>{
    this.spinner.hide();
  if(error.error?.message){
    this.responseMessage = error.error?.message;
  }
  else
  {
    this.responseMessage =GlobalConstants.genericError;
  }
  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
   })
  }

}
