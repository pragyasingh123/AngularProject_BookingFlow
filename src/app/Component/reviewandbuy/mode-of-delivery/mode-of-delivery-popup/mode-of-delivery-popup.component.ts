import { Component, OnInit,ChangeDetectorRef} from '@angular/core';
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { SharedService } from 'src/app/Services/shared.service';
import { ResponseData } from 'src/app/models/common/response';
import { DeliveryModeServiceService } from 'src/app/services/delivery-mode-service.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ReviewBuyService } from 'src/app/Services/review-buy.service';
import { StorageDataService } from 'src/app/Services/SharedCache.service';

@Component({
    selector: 'app-mode-of-delivery-popup',
    templateUrl: './mode-of-delivery-popup.component.html',
    styleUrls: ['./mode-of-delivery-popup.component.css']
})
export class ModeOfDeliveryPopupComponent implements OnInit {
    deliveryModes: DeliveryMode;
    deliveryResponse: DeliveryModeResponse;
    deliveryModeRequest: DeliveryModeRequest;
    deliveryModeCache: string;
    responseData: ResponseData;
    selectedModeOfDeleivery: any;
    deliveryResponseData:DeliveryModeResponse[];
    
    constructor(private storageDataService:StorageDataService,private reviewBuyService: ReviewBuyService,private sharedStorage:StorageDataService, private dialog: MatDialogRef<any>, public sharedService: SharedService, private deliveryModeService: DeliveryModeServiceService

    ) {

        this.deliveryModeRequest = new DeliveryModeRequest;
    }
    ngOnInit() {
        if(this.sharedStorage.getStorageData('storedAllServices', true)!=null){
      this.sharedService=this.sharedStorage.getStorageData('storedAllServices', true);
      if(this.sharedService.allDeliveryOptions!=null && this.sharedService.allDeliveryOptions[0]!=undefined){
        this.deliveryResponse=this.sharedService.allDeliveryOptions;

      }
      else{
      this.getDeliveryModeDetails()
       
      }
    }
       
    }

    SetMode(mode: any) {
        this.selectedModeOfDeleivery = mode;
    }

    SendMode() {
        this.dialog.close(this.selectedModeOfDeleivery);
    }
    getDeliveryModeDetails() {
        
        this.deliveryModeService.getDeliveryModeDetails(localStorage.getItem("sessioncode")).subscribe(
            res => {
                if (res != null) {
                    this.responseData = res as ResponseData;
                    if (this.responseData.responseCode == '200') {
                        this.deliveryResponse = this.responseData.data;
                        this.sharedService.allDeliveryOptions=this.responseData.data;
                        this.storageDataService.clearStorageData("storedAllServices");
                        this.storageDataService.setStorageData("storedAllServices",this.sharedService,true);
                    }
                    else {
                        console.log(this.responseData.ResponseMessage);
                    }
                }
            });
    }
}



