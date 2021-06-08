import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CustomerDetailResponse} from 'src/app/models/customer/customer-detail-response';
import { GetSavedJourneys} from 'src/app/models/my-profile/saved-journey-response';
import { Router } from '@angular/router';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { CommonFunctionMyProfile } from 'src/app/services/common-function-my-profile';
import { ResponseData } from 'src/app/models/common/response';
import { ApplicationConstants,MyProfileConstants } from 'src/app/models/Constants/constants.model';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';

@Component({
  selector: 'app-my-profile-detail',
  templateUrl: './my-profile-detail.component.html',
  styleUrls: ['./my-profile-detail.component.css']
  
})
export class MyProfileDetailComponent implements OnInit {

  customerData :CustomerDetailResponse;
  responseData: ResponseData;
  journeyData:GetSavedJourneys;
  locationData:LocationResponseData[];
  constructor(private router: Router, public sharedService: SharedService,private sharedStorage:StorageDataService,public customerService: CustomerServiceService,private commonFunction:CommonFunctionMyProfile) { 
    
  }
  @Input() customerDetailData:CustomerDetailResponse;
  ngOnInit() {
  
    this.sharedService=this.sharedStorage.getStorageData(ApplicationConstants.StoredAllServices,true);
    if(this.sharedService.locationResponseData.length==0 && this.sharedService.locationResponseData==null){
      this.commonFunction.getLocations();
    }
    else{
      this.locationData=this.sharedService.locationResponseData;
    }
    this.getAllSavedJourneys();
    
  }

  ngOnChanges(changes:SimpleChanges){
   this.customerData = new CustomerDetailResponse();
   this.customerData=changes.customerDetailData.currentValue;
  }
  
  openPasswordResetPage(){
    this.router.navigate([`./resetpassword`]);
  }

  getAllSavedJourneys(){
    this.customerService.getSavedJourneys(localStorage.getItem(ApplicationConstants.SessionCode)).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200') {
            this.journeyData = this.responseData.data;
           localStorage.setItem(ApplicationConstants.SessionCode,this.responseData.sessionCode);
           
        }
      }
      });
  }

  getFilteredLocations(nlcCode:any){
    this.locationData=this.sharedService.locationResponseData;
   let stationName= this.locationData.filter(m => m.nlc == nlcCode);
   return stationName[0].description;

  }

  

}
