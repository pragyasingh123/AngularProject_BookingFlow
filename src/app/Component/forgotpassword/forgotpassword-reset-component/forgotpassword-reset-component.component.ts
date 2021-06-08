import { Component, OnInit,Inject ,ChangeDetectorRef} from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { ApplicationConstants,ForgotPasswordConstants } from 'src/app/models/Constants/constants.model';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { ForgotpasswordResetRequest } from 'src/app/models/customer/forget-password-request';
import { RhResponse } from 'src/app/models/common/response';
import { PasswordStrengthValidator } from "src/app/utility/custom-validations/password-strength.validation";
import { MustMatch } from 'src/app/utility/custom-validations/must-match-validation';
import { Router,ActivatedRoute } from '@angular/router';
import {resetInformation} from 'src/app/Component/reset-password/reset-password.component';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgotpassword-reset-component',
  templateUrl: './forgotpassword-reset-component.component.html',
  styleUrls: ['./forgotpassword-reset-component.component.css']
})
export class ForgotpasswordResetComponentComponent implements OnInit {
  isSubmitted:boolean = false;
  customerResetPasswordRequst: ForgotpasswordResetRequest;
  IsPasswordChanged: boolean = false;
  responseData: ResponseData;
  rhResponse:RhResponse;
  diaglogMessage:string;
  changedSuccessfully:boolean=false;


  constructor(private formbuilder: FormBuilder,private cdref:ChangeDetectorRef,private route:ActivatedRoute,private dialog: MatDialog, public customerService: CustomerServiceService) {
this.customerResetPasswordRequst= new ForgotpasswordResetRequest();


   }
  resetForm:any = this.formbuilder.group({
    newpassword:new FormControl('', [Validators.required,PasswordStrengthValidator]),
    confirmpassword:new FormControl('', [Validators.required])
   
  },{
    validator: [MustMatch('newpassword', 'confirmpassword')]

  });


  ngOnInit() {
    debugger;
    this.route.queryParamMap.subscribe(params=>{
      this.customerResetPasswordRequst.tempPassword= params.get(ForgotPasswordConstants.TemporaryPassword);
      this.customerResetPasswordRequst.Guid= params.get(ForgotPasswordConstants.ReminderId);
    });
  }

  submitData(){
    debugger;
    if(this.resetForm.valid)
  {
    var resetPaawordFormData = this.resetForm.value;
     this.customerResetPasswordRequst.NewPassword=resetPaawordFormData.newpassword;
 
    this.resetPasswordCustomer(this.customerResetPasswordRequst)
  }
  this.isSubmitted = true;
  }
  resetPasswordCustomer(CustomerResetPasswordRequst:any)
{
   this.customerService.forgetResetPassword(this.customerResetPasswordRequst).subscribe(res => {
  if(res!=null)
  { 
    this.responseData = res as ResponseData;
    this.rhResponse=this.responseData.data;
    if(this.rhResponse.rhresponse.statuscode=="0" && this.responseData.responseCode == '200'){
        this.diaglogMessage="Your password has been changed successfully";
        this.changedSuccessfully=true;
    }
    else{
      this.diaglogMessage= this.rhResponse.rhresponse.errors[0].errordesc;
    }
    
    let logoutDialog =  this.dialog.open(resetInformation,{
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '600px',
      panelClass:'logoutDialog',
      data:{
        message: this.diaglogMessage,
        buttonText: 'Ok',
        changedSuccessfully:this.changedSuccessfully     }
    });
    logoutDialog.afterClosed().subscribe(res=>{
      if(res){
        this.resetForm.setValue({newpassword: ''},{confirmpassword:''});
         this.cdref.detectChanges();

       }
   })
}
   });
   }

}
