import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  responseMessage:any;
  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private dialogRef:MatDialogRef<LoginComponent>,
    private spinner: NgxSpinnerService,
    private snackbarService: SnackbarService
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['admin@gmail.com',[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:['',[Validators.required]]
    })
  }
    handleSubmit(){
      this.spinner.show();
      var formData = this.loginForm.value;
      var data ={
        email: formData.email,
        password:formData.password
      }
      this.userService.login(data).subscribe((response:any)=>{
        this.spinner.hide();
        this.dialogRef.close(),
          localStorage.setItem('token',response.token);
          this.router.navigate(['/cafe/dashboard']);
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
}
