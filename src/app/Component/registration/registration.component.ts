import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SigninComponent } from 'src/app/Component/signin/signin.component';
import { MatDialog } from '@angular/material';
import { RegistationRequest } from 'src/app/models/customer/registation-request';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { RegistationResponse } from 'src/app/models/customer/registation-response';
import { PasswordStrengthValidator } from "src/app/utility/custom-validations/password-strength.validation"


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  customerRegisterRequest: RegistationRequest;
  maxDate =  new Date(new Date().setDate(new Date().getDate()));
  responseData: ResponseData;
  document:any;
  customerRegisterResponse: RegistationResponse;
  isSubmitted:boolean = false;
  isShowSuccessSubmissionMessage:boolean=false;
  constructor(private formbuilder: FormBuilder,private dialog: MatDialog, public customerService: CustomerServiceService) { }

  ngOnInit() {
  }
  registrationForm:any = this.formbuilder.group({
    title:new FormControl(''),
    firstName:new FormControl('', [Validators.required]),
    surname:new FormControl('', [Validators.required]),
    email:new FormControl('', [Validators.required, Validators.email]),
    cnf_email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', [Validators.required, Validators.minLength(8),PasswordStrengthValidator]),
    cnf_password:new FormControl('', [Validators.required, Validators.minLength(8)]),
    postcode:new FormControl(''),
    termsandCondition:new FormControl('', [Validators.required])
  });

  onSubmit(){
    this.isSubmitted = true

    if (this.registrationForm.valid) {
      var registerFormData = this.registrationForm.value;
      this.customerRegisterRequest = new RegistationRequest();
      this.customerRegisterRequest.email = registerFormData.email;
      this.customerRegisterRequest.firstname = registerFormData.firstName;
      this.customerRegisterRequest.lastname = registerFormData.surname;
      this.customerRegisterRequest.title = "Miss";
      this.customerRegisterRequest.password = registerFormData.password;
     
    
      this.registerCustomer(this.customerRegisterRequest);
    }
    else{
     this.scrollToError();
    }
    this.isSubmitted = true;
  
  }

scrollTo(el: Element): void {
    if (el) {
       el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
 }
 scrollToError(): void {
    const firstElementWithError = document.querySelector('.validation-err');
    this.scrollTo(firstElementWithError);
 }

  registerCustomer(CustomerRegisterRequest: any) {
    this.customerService.registerCustomer(this.customerRegisterRequest).subscribe(res => {
      if (res != null) {
        this.responseData = res as ResponseData;
        if (this.responseData.responseCode == '200') {
          this.customerRegisterResponse = this.responseData.data;
          if (this.customerRegisterResponse.registrationsuccessful) {
          
            this.isShowSuccessSubmissionMessage=true;

          }
        }
     
      }
    });
  }

}
