import { Component, OnInit, ViewEncapsulation ,ChangeDetectorRef} from '@angular/core';
import { CustomerDetailResponse} from 'src/app/models/customer/customer-detail-response';
import { AddNewAddressRequest } from 'src/app/models/customer/add-new-address-request';
import { AddressResponse } from 'src/app/models/customer/address-response';
import { RhResponse } from 'src/app/models/common/response';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { ResponseData } from 'src/app/models/common/response';
import { CommonFunctionMyProfile} from 'src/app/Services/common-function-my-profile';
import { CustomerServiceService } from 'src/app/services/customer-service.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  responseData:ResponseData;
  addressResponse:AddressResponse;
  sharedServiceData:SharedService;

  customerDetail:CustomerDetailResponse;
  constructor(private cdref:ChangeDetectorRef,private customerService:CustomerServiceService,public sharedService: SharedService,private commonfunction:CommonFunctionMyProfile, private sharedStorage:StorageDataService) {
this.addressResponse= new AddressResponse();
   }

  ngOnInit() {
    
    if(localStorage.getItem('email') !=null && localStorage.getItem('customerId')!=null){
      this.customerDetail = new CustomerDetailResponse();
     this.customerDetail.customerid=localStorage.getItem("customerId");
     this.customerDetail.firstname=localStorage.getItem("firstname");
     this.customerDetail.surname=localStorage.getItem("lastname");
     this.customerDetail.email=localStorage.getItem("email");
    }
    if(this.sharedStorage.getStorageData('storedAllServices', true)!=null){
      this.sharedService=this.sharedStorage.getStorageData('storedAllServices', true);
      if(this.sharedService.listOfUserAddresses!=null && this.sharedService.listOfUserAddresses.length!=0){
        this.addressResponse.address=this.sharedService.listOfUserAddresses;
      }
      else{
        this.getUserAddresses();
      }
    }
  
  }

  getUserAddresses(){
    
    this.customerService.getUserAddresses(localStorage.getItem("sessioncode")).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          this.addressResponse=this.responseData.data.getaddresses;
          if (this.responseData.responseCode == '200' && this.addressResponse.rhresponse.statuscode=="0") {
            console.log("getUserAddresses",this.responseData.sessionCode);
           localStorage.setItem("sessioncode",this.responseData.sessionCode);
           this.sharedService.listOfUserAddresses=this.addressResponse.address;
           this.sharedStorage.clearStorageData("storedAllServices");
           this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
        }
      }
 
      });
  }

}
