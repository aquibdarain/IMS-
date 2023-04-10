import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
signupForm:any= FormGroup;
responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:['aquib darain',[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:['darainaquib@gmail.com',[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:['9370805845',[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:['123456',[Validators.required]],
    })
  }

  handleSubmit(){
    this.spinner.show();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      password:formData.password
    }
    this.userService.signup(data).subscribe((response:any)=>{
      this.spinner.hide();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{
      this.spinner.hide();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage =GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

}
