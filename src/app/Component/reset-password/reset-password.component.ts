import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {  MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import {ChangePasswordRequest } from 'src/app/models/my-profile/change-password-request';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { RhResponse } from 'src/app/models/common/response';
import { PasswordStrengthValidator } from "src/app/utility/custom-validations/password-strength.validation";
import { MustMatch } from 'src/app/utility/custom-validations/must-match-validation';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted:boolean = false;
  customerResetPasswordRequst: ChangePasswordRequest;
  IsPasswordChanged: boolean = false;
  responseData: ResponseData;
  rhResponse:RhResponse;


  constructor(private formbuilder: FormBuilder,private dialog: MatDialog, public customerService: CustomerServiceService) { }
  resetForm:any = this.formbuilder.group({
    existingpassword:new FormControl('',[Validators.required]),
    newpassword:new FormControl('', [Validators.required,PasswordStrengthValidator]),
    confirmpassword:new FormControl('', [Validators.required])
   
  },{
    validator: [MustMatch('newpassword', 'confirmpassword')]

  });


  ngOnInit() {
  }

  submitData(){
    if(this.resetForm.valid)
  {
    var resetPaawordFormData = this.resetForm.value;
    this.customerResetPasswordRequst = new ChangePasswordRequest();
    this.customerResetPasswordRequst.NewPassword=resetPaawordFormData.newpassword;
  this.customerResetPasswordRequst.ExistingPassword=resetPaawordFormData.existingpassword;
  this.customerResetPasswordRequst.sessionid=localStorage.getItem("sessioncode");
    this.resetPasswordCustomer(this.customerResetPasswordRequst)
  }
  this.isSubmitted = true;
  }
  resetPasswordCustomer(CustomerResetPasswordRequst:any)
{
   this.customerService.resetPasswordCustomer(this.customerResetPasswordRequst).subscribe(res => {
  if(res!=null)
  { 
    this.responseData = res as ResponseData;
    this.rhResponse=this.responseData.data;
    if(this.rhResponse.rhresponse.statuscode=="0" && this.responseData.responseCode == '200'){
        this.IsPasswordChanged=true;
        let logoutDialog =  this.dialog.open(resetInformation,{
          disableClose: false,
          maxWidth: '80vw',
          maxHeight: '90vh',
          width: '600px',
          panelClass:'logoutDialog',
          data:{
            message: 'Your password has been changed successfully',
            buttonText: 'Ok',
            changedSuccessfully:true
          }
        });
    
    }
    else{
      let logoutDialog =  this.dialog.open(resetInformation,{
        disableClose: false,
        maxWidth: '80vw',
        maxHeight: '90vh',
        width: '600px',
        panelClass:'logoutDialog',
        data:{
          message: this.rhResponse.rhresponse.errors[0].errordesc,
          buttonText: 'Ok',
          changedSuccessfully:false
        }
      });
    }
   
   }

   })
}

}


@Component({
  selector: 'reset-poput',
  templateUrl: 'Information-popup.html',
})
export class resetInformation {
 
  message:string;
  buttonText:string;
  changedSuccessfully:boolean;
  constructor( private router:Router,@Inject(MAT_DIALOG_DATA) private data: any,public dialog: MatDialogRef<resetInformation>,public spinnerService: NgxSpinnerService,) {
    if(data){
      this.message = data.message || this.message;
      this.changedSuccessfully=data.changedSuccessfully;
      if (data.buttonText) {
        this.buttonText=data.buttonText;
   
      }
        }
  }
 
 
  CloseDialog(){
   if(this.changedSuccessfully){
    this.router.navigate([`./myprofile`]);
  
   }
  }

}
