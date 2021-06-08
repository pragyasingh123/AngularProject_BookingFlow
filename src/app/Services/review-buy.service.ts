import { Injectable } from '@angular/core';
import { HttpClientService } from '../utility/http-client.service';
import { ApireferenceService } from '../utility/apireference.service';
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { SharedService } from 'src/app/Services/shared.service';
import { ResponseData } from 'src/app/models/common/response';
import { DeliveryModeServiceService } from 'src/app/services/delivery-mode-service.service';
import { StorageDataService } from 'src/app/Services/SharedCache.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewBuyService {
  deliveryModes: DeliveryMode;
  deliveryResponse       :DeliveryModeResponse;
  responseData: ResponseData;
  constructor( private storageDataService:StorageDataService,
     public sharedService: SharedService,private deliveryModeService: DeliveryModeServiceService,private httpClientService: HttpClientService, private apiPath: ApireferenceService) { }
  
  
  makeSeatReservation(SeatReservationRequest : any){
    return this.httpClientService.HttpPostRequest(SeatReservationRequest, this.apiPath.makeSeatReservation,);
  }

  getDeliveryModeDetails() {
   
   let delieveryModes = new DeliveryModeResponse();
     this.deliveryModeService.getDeliveryModeDetails(localStorage.getItem("sessioncode")).subscribe(
       
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200') {
            this.deliveryResponse = this.responseData.data;
            this.sharedService.allDeliveryOptions=this.responseData.data;
            this.storageDataService.clearStorageData("storedAllServices");
            this.storageDataService.setStorageData("storedAllServices",this.sharedService,true);
            this.deliveryModes=this.deliveryModes;
          }
          else {
            console.log(this.responseData.ResponseMessage);
          }
        }
      });
      return this.deliveryModes;
    }

  removejourney(removeJourneyRequest:any,sessioncode :any) {
    return this.httpClientService.HttpPostRequest(removeJourneyRequest, this.apiPath.removeJourney+"?sessionid="+sessioncode);
  }
  getsaveDeliveryModeDetails() {
      this.deliveryModeService.getDeliveryModeDetails('N-mY5rRhDlBiVA3orpwNHX+a.tprhbp03z').subscribe(
          // this.deliveryModeService.getDeliveryModeDetails().subscribe(	
          res => {
              if (res != null) {
                  this.responseData = res as ResponseData;
                  if (this.responseData.responseCode == '200') {
                      this.deliveryResponse = this.responseData.data;
                      this.sharedService.allDeliveryOptions = this.responseData.data;
                      this.storageDataService.clearStorageData("storedAllServices");
                      this.storageDataService.setStorageData("storedAllServices", this.sharedService, true);
                  }
                  else {
                      console.log(this.responseData.ResponseMessage);
                  }
              }
          });
  }
  getReservationConditions(ReservationRequest: any)
  {
    return this.httpClientService.HttpGetRequest(this.apiPath.getReservationConditions + "?sessionid="+ ReservationRequest.sessionid + "&tripNo="+ ReservationRequest.tripno);
  }

  getReviewBuyPageData(ReviewBuyPageRequestData : any)
  {
    return this.httpClientService.HttpGetRequest(this.apiPath.getReviewAndBuyDetails + '?sessionid=' + ReviewBuyPageRequestData);
  }
}
