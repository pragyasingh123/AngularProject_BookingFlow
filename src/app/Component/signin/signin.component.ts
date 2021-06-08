import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';
import { Router } from '@angular/router';
import { CustomerLoginRequest } from 'src/app/models/customer/customer-login-request';
import { CustomerLoginResponse } from 'src/app/models/customer/customer-login-response';
import { CustomerDetailResponse} from 'src/app/models/customer/customer-detail-response';
import { ResponseData } from 'src/app/models/common/response';
import {MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public shareService:SharedService,public spinnerService: NgxSpinnerService,private customerServiceService: CustomerServiceService,private router: Router,public dialog: MatDialog) { }

  customerLoginRequest:CustomerLoginRequest;
  responseData: ResponseData;
  customerLoginResponse: CustomerLoginResponse;
  customerdetailResponse:CustomerDetailResponse;
  showErroMessage: boolean = false ;
  sessionID : string;
  ngOnInit() {
  }
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  registerForm()
  {
    this.dialog.closeAll();
    this.router.navigate([`./registration`]);
  
  }

  forgetPassword(){
    this.dialog.closeAll();
    this.router.navigate([`./forgotpassword`]);
  

  }
  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
      var loginFormData = this.form.value;
      this.CustomerLogin(loginFormData);
    }
  }

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
  CustomerLogin(loginFormData: any) {
    
    this.customerLoginRequest = new CustomerLoginRequest();
    this.customerLoginRequest.password=loginFormData.password;
    this.customerLoginRequest.email = loginFormData.username;
    this.spinnerService.show();
    this.customerServiceService.checkCustomerLogin(this.customerLoginRequest,localStorage.getItem("sessioncode")).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200') {
            this.customerLoginResponse = this.responseData.data;
            if(this.customerLoginResponse.customerid==null){
              this.showErroMessage=true;
              this.spinnerService.hide();
            }
            else{
            
              this.customerServiceService.getCustomerInformation(localStorage.getItem("sessioncode")).subscribe(
              res=>{
              if(res!=null){
                this.responseData = res as ResponseData;
                if (this.responseData.responseCode == '200') {
                 this.customerdetailResponse= this.responseData.data ;
                 localStorage.setItem("email",this.customerdetailResponse.email);
                 localStorage.setItem("firstname",this.customerdetailResponse.firstname);
                 localStorage.setItem("customerId",this.customerdetailResponse.customerid);
                 localStorage.setItem("lastname",this.customerdetailResponse.surname);
                 localStorage.setItem("sessioncode",this.responseData.sessionCode);
               
                 this.shareService.isUserLoggedIn=true;
                 this.dialog.closeAll();
                 this.shareService.callMethodOfSecondComponent(true);
                 this.spinnerService.hide();
                } 
              }

              }

              )
            }
        }
      }
      });
  }
}
