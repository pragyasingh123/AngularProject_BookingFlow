import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {  MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { AddNewAddressRequest } from 'src/app/models/customer/add-new-address-request';
import { RhResponse } from 'src/app/models/common/response';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.component.html',
  styleUrls: ['./add-new-address.component.css']
})
export class AddNewAddressComponent implements OnInit {

  countryNames: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan', 'New York'];
  isSubmitted:boolean = false;

  responseData: ResponseData;
  rhResponse:RhResponse;
  usernewAddress:AddNewAddressRequest;
  ErrorMessage:string;
  ErrorFromApi:Boolean;


  constructor(private formbuilder: FormBuilder,private dialog: MatDialogRef<any>,public spinnerService: NgxSpinnerService, public customerService: CustomerServiceService) {
    this.ErrorFromApi=false;
   }
  addressForm:any = this.formbuilder.group({
    postcode:new FormControl('',[Validators.required]),
    firstlineAddress:new FormControl('', [Validators.required]),
    secondlineAddress:new FormControl('', [Validators.required]),
    thirdlineAddress:new FormControl(''),
    city:new FormControl('', [Validators.required]),
    country:new FormControl('', [Validators.required])
   
  });
  ngOnInit() {
  }

  get country() {
    return this.addressForm.get('country');
  }

  changecountry(e) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    })
  }

  submitData(){
    if(this.addressForm.valid)
  {
    var addressFormData = this.addressForm.value;
    this.usernewAddress= new AddNewAddressRequest();
    this.usernewAddress.postcode=addressFormData.postcode;
    this.usernewAddress.address1=addressFormData.firstlineAddress;
    this.usernewAddress.address2=addressFormData.secondlineAddress;
    this.usernewAddress.address3=addressFormData.thirdlineAddress;
    this.usernewAddress.town=addressFormData.city;
    this.usernewAddress.countrycode= addressFormData.country;
    this.usernewAddress.isdefault="0";
    this.usernewAddress.addressee=localStorage.getItem("firstname");
    this.usernewAddress.addresstype="D";
    this.usernewAddress.sessionid=localStorage.getItem("sessioncode");
    this.spinnerService.show();
    this.addAddressinProfile(this.usernewAddress);
   
  }
  this.isSubmitted = true;
  }
  
  addAddressinProfile(AddNewAddressRequest:any){
    this.customerService.addNewAddress(this.usernewAddress).subscribe(res => {
      if(res!=null)
      { 
        this.responseData = res as ResponseData;
        this.rhResponse=this.responseData.data;
        if(this.responseData.data.rhresponse.statuscode=="0" && this.responseData.responseCode == '200'){
           
          localStorage.setItem("sessioncode",this.responseData.sessionCode);
        }
        else{
          this.ErrorFromApi=true;
          this.ErrorMessage=this.responseData.data.rhresponse.errors[0].errordesc;
        }
       
          this.spinnerService.hide();
          this.dialog.close(this.responseData.data);
       
       }
    
       })
  }

}
