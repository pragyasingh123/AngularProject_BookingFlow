import { Injectable } from '@angular/core';
import { LocationResponseData } from '../models/locations/location-response-data';
import { Railcard } from '../models/journey/railcards/railcard';
import { ResponseData } from '../models/common/response';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientService } from '../utility/http-client.service';
import { ApireferenceService } from '../utility/apireference.service';
import { RailCardModel } from '../models/journey/railcard.model';
import { CommonServiceService } from 'src/app/Services/common-service.service';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { ApplicationConstants } from 'src/app/models/Constants/constants.model';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { AddNewAddressRequest } from 'src/app/models/customer/add-new-address-request';
import { AddressResponse } from 'src/app/models/customer/address-response';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionMyProfile {

  constructor(public sharedService: SharedService,private sharedStorage:StorageDataService,
  private customerService:CustomerServiceService,  private commonServiceService:CommonServiceService,private httpClientService:HttpClientService,private apiPath:ApireferenceService) { }
  
    public locations: LocationResponseData[];
  public railCards: RailCardModel[];
  responseData: ResponseData;
  public locationData: LocationResponseData[];
  addressResponse:AddressResponse;
  sharedServiceData:SharedService;


  getLocations(){

    this.commonServiceService.getLocations().subscribe(
        res => {
          if (res != null) {
            this.responseData = res as ResponseData;
            if (this.responseData.responseCode == '200') {
              this.sharedService.locationResponseData = this.responseData.data;
              this.locationData = this.responseData.data;
              this.sharedService.locationResponseData=this.locationData;
              this.sharedStorage.clearStorageData(ApplicationConstants.StoredAllServices);
              this.sharedStorage.setStorageData(ApplicationConstants.StoredAllServices,this.sharedService,true);
            }
           
          }
    
        });
        return this.locationData;
  }


 
  
  
}
