import { Component, OnInit, ViewEncapsulation ,ChangeDetectorRef,Input, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { CustomerDetailResponse} from 'src/app/models/customer/customer-detail-response';
import { AddNewAddressRequest } from 'src/app/models/customer/add-new-address-request';
import { RemoveAddressRequest } from 'src/app/models/customer/remove-address-request';
import { AddressResponse } from 'src/app/models/customer/address-response';
import { RhResponse } from 'src/app/models/common/response';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { ResponseData } from 'src/app/models/common/response';
import { CommonFunctionMyProfile} from 'src/app/Services/common-function-my-profile';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { AddNewAddressComponent } from 'src/app/Component/reviewandbuy/mode-of-delivery/add-new-address/add-new-address.component';
import { deletePopup } from 'src/app/Component/reviewandbuy/mode-of-delivery/mode-of-delivery.component';

@Component({
  selector: 'app-address-section',
  templateUrl: './address-section.component.html',
  styleUrls: ['./address-section.component.css']
})
export class AddressSectionComponent implements OnInit {

  responseData:ResponseData;
  addressResponse:AddressResponse;
  sharedServiceData:SharedService;
  removeAddressRequest:RemoveAddressRequest;
  addressid:string;

  customerDetail:CustomerDetailResponse;
  constructor(public spinnerService: NgxSpinnerService,public dialog: MatDialog,private cdref:ChangeDetectorRef,private customerService:CustomerServiceService,public sharedService: SharedService,private commonfunction:CommonFunctionMyProfile, private sharedStorage:StorageDataService) {

  }

  @Input() addressList:AddressResponse;

  ngOnInit() {
    this.addressResponse=this.addressList;
    
    this.SetAdressType();
  }

  SetAdressType(){
      this.addressResponse.address.forEach(function(value,key){
            if(value.addresstype=="D"){
              value.addresstype="General Address";
            }
            if(value.addresstype=="I"){
              value.addresstype="ITSO Address";
            }
            if(value.addresstype=="B"){
              value.addresstype="Home Address";
            }

      })

  }
  addNewAddress(){
    let addAddressDialog=this.dialog.open(AddNewAddressComponent, {
      maxWidth: '90%',
      maxHeight: '90vh',
      width: '720px',
      panelClass: 'add-new-address-popup'
    });
    addAddressDialog.afterClosed().subscribe(res=>{
      if(res!=null){
        if(res.rhresponse.statuscode=="0"){
           
           this.getUserAddresses();
         
           this.cdref.detectChanges();
        }
        

      }
    });

  }

  opendeletepopup(addressid:any)
  {
    this.addressid=addressid;
   let  popupDelete= this.dialog.open(deletePopup, {
      maxWidth: '90%',
      maxHeight: '90vh',
      width: '400px',
      panelClass: 'delete-popup'
    });
    popupDelete.afterClosed().subscribe(res=>{
      if(res){

        this.removeUserAddress();

        this.cdref.detectChanges();

      }
    });

  }

  removeUserAddress(){
    this.removeAddressRequest = new RemoveAddressRequest();
    this.removeAddressRequest.sessionid=localStorage.getItem("sessioncode");
    this.removeAddressRequest.addressid=this.addressid;
    this.spinnerService.show();
    this.customerService.removeUserAddress(this.removeAddressRequest).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200' && this.responseData.data.rhresponse.statuscode=="0") {
            this.addressResponse.address=this.addressResponse.address.filter(x=>x.addressid!=this.addressid);
           localStorage.setItem("sessioncode",this.responseData.sessionCode);
           this.sharedService.listOfUserAddresses=this.addressResponse.address;
           this.sharedStorage.clearStorageData("storedAllServices");
           this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
           this.cdref.detectChanges();
           
        }
      }
      this.spinnerService.hide();
      });

  }
  getUserAddresses(){
    this.spinnerService.show();
    this.customerService.getUserAddresses(localStorage.getItem("sessioncode")).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          this.addressResponse=this.responseData.data.getaddresses;
          if (this.responseData.responseCode == '200' && this.addressResponse.rhresponse.statuscode=="0") {
            console.log("getUserAddresses",this.responseData.sessionCode);
           localStorage.setItem("sessioncode",this.responseData.sessionCode);
           this.sharedService.listOfUserAddresses=this.addressResponse.address;
           this.SetAdressType();
           this.cdref.detectChanges();
           this.sharedStorage.clearStorageData("storedAllServices");
           this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
        }
        this.spinnerService.hide();
      }
 
      });
  }

}
