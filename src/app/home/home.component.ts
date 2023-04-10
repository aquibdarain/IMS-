import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog,
    private router:Router,
    private userServices:UserService) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') !=null){
      this.userServices.checkToken().subscribe((response:any)=>{
        this.router.navigate([/*'./cafe/dashboard'*/]);
      },(error:any)=>{
        console.log(error);
      })
    }
  }

  signupAction(){
 const dialogConfig = new MatDialogConfig();
 dialogConfig.width ="550px"
 this.dialog.open(SignupComponent,dialogConfig)
  }

  loginAction(){
    const dialogConfig =new MatDialogConfig();
    dialogConfig.width ="550px"
    this.dialog.open(LoginComponent,dialogConfig)
  }


}
