import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ModeOfDeliveryPopupComponent } from './mode-of-delivery-popup/mode-of-delivery-popup.component';
import { AddNewAddressComponent } from './add-new-address/add-new-address.component';
import { SelectedModeOfDeleivery } from 'src/app/models/review-and-buy/selected-mode-deleivery';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {  MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { AddNewAddressRequest } from 'src/app/models/customer/add-new-address-request';
import { AddressResponse } from 'src/app/models/customer/address-response';
import { RhResponse } from 'src/app/models/common/response';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { ModifyQttSearchExpendedComponent } from 'src/app/Component/mixing-deck/modify-qtt-search-expended/modify-qtt-search-expended.component';
import { Observable } from 'rxjs';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';
import { CommonServiceService } from 'src/app/Services/common-service.service';

@Component({
  selector: 'app-mode-of-delivery',
  templateUrl: './mode-of-delivery.component.html',
  styleUrls: ['../reviewandbuy.component.css', './mode-of-delivery.component.css'
  ]
})
export class ModeOfDeliveryComponent implements OnInit {
  displayDeliverymode:string;
  displayDescription:string;
  selectedDeliveryMode: string;
  deliveryResponse: DeliveryModeResponse;
  locationData:LocationResponseData[];
  responseData:ResponseData;
  addressResponse:AddressResponse;
  sharedServiceData:SharedService;
  searchText:string;
  constructor(private cdref:ChangeDetectorRef,public sharedService: SharedService,public modifyComponent:ModifyQttSearchExpendedComponent,
    private sharedStorage:StorageDataService,private formbuilder: FormBuilder,private commonServiceService: CommonServiceService,public dialog: MatDialog,public modeofDeliveryPopup:ModeOfDeliveryPopupComponent,public spinnerService: NgxSpinnerService, public customerService: CustomerServiceService) {
      this.addressResponse = new AddressResponse();
      this.deliveryResponse = new DeliveryModeResponse();
      this.deliveryResponse.id = 9;

   }


  ngOnInit() {
    if(this.sharedStorage.getStorageData('storedAllServices', true)!=null){
      this.sharedService=this.sharedStorage.getStorageData('storedAllServices', true);
      if(this.sharedService.listOfUserAddresses!=null && this.sharedService.listOfUserAddresses.length!=0){
        this.addressResponse.address=this.sharedService.listOfUserAddresses;
      }
      else{
        this.getUserAddresses();
      }
    }
    if(this.sharedService.locationResponseData==null || this.sharedService.locationResponseData.length==0){
        this.getLocations();
    }
    else{
      this.locationData=this.sharedService.locationResponseData;
    }
    
  }

getLocations(){
  this.commonServiceService.getLocations().subscribe(
    res => {
      if (res != null) {
        this.responseData = res as ResponseData;
        if (this.responseData.responseCode == '200') {
          this.sharedService.locationResponseData = this.responseData.data;
          this.locationData = this.responseData.data;
        }
       
      }

    });

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
  removeUserAddressOk(){

    
  }

  removeUserAddress(){
    this.customerService.removeUserAddress(localStorage.getItem("sessioncode")).subscribe(
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


  
  

  opendeliverymode()
  {
   let deliveryDialog=  this.dialog.open(ModeOfDeliveryPopupComponent, {
      maxWidth: '90%',
      maxHeight: '90vh',
      width: '600px',
      panelClass: 'deliveryModeModal'
    });
    deliveryDialog.afterClosed().subscribe(res=>{
      if(res!=null && res!=""){
        this.deliveryResponse=res;
        this.cdref.detectChanges();
      }
     
    });
  }
  addNewAddress()
  {
    this.dialog.open(AddNewAddressComponent, {
      maxWidth: '90%',
      maxHeight: '90vh',
      width: '720px',
      panelClass: 'add-new-address-popup'
    });
  }
  opendeletepopup()
  {
    this.dialog.open(deletePopup, {
      maxWidth: '90%',
      maxHeight: '90vh',
      width: '400px',
      panelClass: 'delete-popup'
    });
  }
    displayDeliverymodeshow() {
        this.modeofDeliveryPopup.getDeliveryModeDetails();

    }


  
}
@Component({
  selector: 'delete-popup',
  templateUrl: 'delete-popup.html',
})
export class deletePopup {
  constructor(public dialog: MatDialogRef<deletePopup>) {}
 
  

}
