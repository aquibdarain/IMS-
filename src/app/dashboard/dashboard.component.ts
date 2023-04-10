import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  data: any;
  responseMessage: any;
  ngAfterViewInit() {}

  constructor(private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private snackbarService:SnackbarService) {
      this.spinner.show();
      this.dashboardData();
    }

    dashboardData(){
      this.dashboardService.getDetails().subscribe((response:any)=>{
         this.spinner.hide();
         this.data = response;
      },(error:any)=>{
        this.spinner.hide();
        console.log(error);
        if(error.error?.message){
          this.responseMessage =  error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
      })
    }
}
