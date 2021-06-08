import { Injectable, ɵbypassSanitizationTrustUrl } from '@angular/core';
import { ApireferenceService } from 'src/app/utility/apireference.service';
import { HttpClientService } from '../utility/http-client.service';
import { SharedService } from 'src/app/Services/shared.service';
import { url } from 'inspector';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class DeliveryModeServiceService {

  constructor(private httpClientService: HttpClientService, private apiPath: ApireferenceService) { }
  getDeliveryMode(deliveryModeRequest:any) {
    return this.httpClientService.HttpPostRequest(deliveryModeRequest, this.apiPath.RailDeliveryModeDetailsRail);
  }

  saveDeliveryModeData(deliveryModeRequest:any) {
    return this.httpClientService.HttpPostRequest(deliveryModeRequest, this.apiPath.saveDeliveryModeData);
  }
  // getDeliveryModeDetails() 
  // {
  //  return this.httpClientService.HttpGetRequest(this.apiPath.RailDeliveryModeDetailsRail);
  //  }
  // }
  getDeliveryModeDetails(sessionid:any) 
  {
   return this.httpClientService.HttpGetRequest(this.apiPath.CustomerDeliveryModeDetails+"?sessionid="+sessionid);
  }
  // saveDeliveryMode(sessionid:any,deliveryOptionId:any,todLocationNlc:any) {
  //   return this.httpClientService.HttpPostRequest(deliveryModeRequest, this.apiPath.saveDeliveryModeData);
  // }

}