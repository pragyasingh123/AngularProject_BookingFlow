import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { SigninComponent } from '../signin/signin.component';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {  MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { ForgetPasswordRequest } from 'src/app/models/customer/forget-password-request';
import { RhResponse } from 'src/app/models/common/response';
import { PasswordStrengthValidator } from "src/app/utility/custom-validations/password-strength.validation";
import { MustMatch } from 'src/app/utility/custom-validations/must-match-validation';
import { Router } from '@angular/router';
import {resetInformation} from 'src/app/Component/reset-password/reset-password.component';
import { ApplicationConstants,ForgotPasswordConstants } from 'src/app/models/Constants/constants.model';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  isSubmitted:boolean = false;
  responseData:ResponseData;
  forgotpasswordRequest:ForgetPasswordRequest;
  sharedServiceData:SharedService;
  isSuccess:boolean=false;
  constructor(private cdref:ChangeDetectorRef,private formbuilder: FormBuilder,public sharedService: SharedService,private dialog: MatDialog, public customerService: CustomerServiceService) { }
  forgotForm:any = this.formbuilder.group({
    email:new FormControl('',[Validators.required])
   
  });


  loginPopup()
  {
    this.dialog.open(SigninComponent,{
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '600px',
    });
  }
  ngOnInit() {
  }

  submitData(){

    if(this.forgotForm.valid)
    {
      var formData = this.forgotForm.value;
      this.forgotpasswordRequest = new ForgetPasswordRequest();
      this.forgotpasswordRequest.RedirectUrl=ForgotPasswordConstants.RedirectUrl;
      this.forgotpasswordRequest.Email=formData.email;
      this.forgotpasswordRequest.sessionid=localStorage.getItem(ApplicationConstants.SessionCode);
  
    this.sendResetEmailPassword()
    }
    this.isSubmitted=true;
  }

  sendResetEmailPassword(){
    
    this.customerService.sendEmailToResetPasswordCustomer(this.forgotpasswordRequest).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
        
          if (this.responseData.responseCode == '200' && this.responseData.data.rhresponse.statuscode=="0") {
           localStorage.setItem(ApplicationConstants.SessionCode,this.responseData.sessionCode);
           let passwordreset =  this.dialog.open(resetInformation,{
            disableClose: false,
            maxWidth: '80vw',
            maxHeight: '90vh',
            width: '600px',
            panelClass:'logoutDialog',
            data:{
              message: ForgotPasswordConstants.DialogSuccessfulMessage,
              buttonText: ForgotPasswordConstants.DialogButtonText,
              changedSuccessfully:true
            }

          });
          passwordreset.afterClosed().subscribe(res=>{
            if(res){
              this.forgotForm.setValue({email: ''});
              this.isSuccess=true;
           this.cdref.detectChanges();

            }
           
          });
          //  this.sharedService.listOfUserAddresses=this.addressResponse.address;
          //  this.sharedStorage.clearStorageData("storedAllServices");
          //  this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
        }
      }
 
      });
  }

}


