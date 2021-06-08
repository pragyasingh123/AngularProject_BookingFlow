import { Injectable,EventEmitter, Output } from '@angular/core';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { RailCardModel } from '../models/journey/railcard.model';
import { JourneyFareDetails, JourneyResponse } from '../models/journey/search-services-response';
import { FareBreakupModel,FareModel } from '../models/journey/fare-model';
import { ResponseData } from '../models/common/response';
import { AddJourneyToBasketRequest } from '../models/journey-extras/evaluate-journey-request';
import { SaveForLaterJourneyRequest } from '../models/journey-extras/save-journey';
import { AlertMessage } from '../models/common/alert-message';
import { ManagePageIndex } from '../models/journey/show-earlier-later-request';
import { SetAllservicesService } from '../Services/set-allservices.service';
import { BehaviorSubject } from 'rxjs';
import {Subject} from 'rxjs'; 
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { DeliveryModeServiceService } from './delivery-mode-service.service';

import { BasketRequestRespose } from '../models/review-and-buy/journey-selected-response';
import { AddNewAddressResponse } from '../models/customer/add-new-address-request';
import { ReviewbuyJourneyDetail } from '../models/review-and-buy/reviewbuy-journey-detail';
import { UsersSavedPreference } from '../models/review-and-buy/user-saved-preferences';
import { PreferenceGroups } from '../models/customer/seating-preference-response';
import { SeatReservationResponse, SeatReservedPlace } from '../models/review-and-buy/seat-reservation-response';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  addReturnTabIndex:any;
  deliveryResponse       :DeliveryModeResponse;
  invokeEvent: Subject<any> = new Subject(); 
  searchRequest: SearchRequestModel;
  isAmendSearchOpen:boolean=false;
  isAmendFresh: boolean;
  locations: LocationResponseData[];
  fare: any;
  sessionId:any;
  isRequestFromAnotherUrl=false;
  allDeliveryOptions:DeliveryModeResponse;
  selectedJourneyResponse:JourneyResponse[];
  isUserLoggedIn:boolean;
  loaderMessage: string;
  IsShowEarlierbuttonDisabledSingleOutward = false;
  IsShowLaterbuttonDisabledSingleOutward = false;
  IsShowEarlierbuttonDisabledSingleReturn = false;
  IsShowLaterbuttonDisabledSingleReturn = false;
  totalFare: number=0;
  railCards: RailCardModel[];
  params:Boolean;
  listOfUserAddresses:AddNewAddressResponse[];
  
  
  //fareBreakupModes: Manage the Fare Breakup Mode S/R for Single and Return - Used in displaying the fare Breakup
  fareBreakupModes:string[]; 
  // fareBreakupModelData : Used to keep fare breakup details which is shown when user click on fare breakup icon on Mixing Deck Screen
  fareBreakupModelData: FareBreakupModel[];

  responseData  : ResponseData;
  // responseData  : ResponseData;
  locationResponseData: LocationResponseData[];
  railcardsListResponseData : RailCardModel[];
  reviewBuyjourneyResponseDetail:ReviewbuyJourneyDetail;
  GetUserSavedPrefValuesAPIResponse: any = [];
  BasketRequestResponse:BasketRequestRespose[];
  TotalJourneyCost : number;
  // managePageIndex : Used to Manage Show Earlier and Later DateTime to display records
  managePageIndex: ManagePageIndex;
  SharedSearchRequest : SearchRequestModel;
  AlertMessageBody : AlertMessage;
  addJourneyToBasketRequest : AddJourneyToBasketRequest;
  saveForLaterJourneyRequest : SaveForLaterJourneyRequest;
  NectarPointsEarned : number;
  IsReservationMandatory : boolean =  false;
  ShowSavedPref : boolean = true;
  SeatPrefMap : any;
  LoyaltyCardNumber : string = '';
  IsLoginRequest : boolean = false;
  @Output() getBasketCount: EventEmitter<any> = new EventEmitter();
  UsersSavedPreferenceShared: UsersSavedPreference[];
  SavedPreferencesShared : PreferenceGroups[];
  IsGetNectarCalled: boolean = false;
  SourceStation : string;
  DestinationStation : string;
  ReviewBuyPageData : any;
  IsSeatReservationDetails : boolean = false;
  NectarCardData : any;
  ReservedSeatData : SeatReservedPlace[];
  IsSeatReservationData : boolean = false;
  IsSessionExpired : boolean = false;
  constructor(public setService:SetAllservicesService) {
    this.locations=new Array<LocationResponseData>();
    this.fareBreakupModelData=new Array<FareBreakupModel>();
    this.locationResponseData=new Array<LocationResponseData>();
    this.railcardsListResponseData= new Array<RailCardModel>();
    this.railCards = new Array<RailCardModel>();
    this.fareBreakupModes = new Array<string>();
    this.managePageIndex=new ManagePageIndex();
    this.selectedJourneyResponse= new Array<JourneyResponse>();
    this.BasketRequestResponse= new Array<BasketRequestRespose>();
    this.listOfUserAddresses= new Array<AddNewAddressResponse>();
    this.allDeliveryOptions=new DeliveryModeResponse();
    this. SeatPrefMap = new Map<string, string>();
    this.UsersSavedPreferenceShared = new Array<UsersSavedPreference>();
    this.SavedPreferencesShared = new Array<PreferenceGroups>();
    this.ResetDateTimeForShowLaterAndEarlier();
    this.ReservedSeatData = new Array<SeatReservedPlace>();

   }

   sendFareData(fareValue: any) {
    this.fare = fareValue;
  }
  
  sendEvaluateRequest(request) {
    this.addJourneyToBasketRequest = request;
  }

  sendSearchRequest(request) {
    this.searchRequest = request;
  }

  //Used to reset the Show Later and Earlier Time whenever required
  ResetDateTimeForShowLaterAndEarlier(){
    this.managePageIndex.startServiceTimeOutwardReturnOpenReturn=null;
    this.managePageIndex.endServiceTimeOutwardReturnOpenReturn=null;
    this.managePageIndex.startServiceTimeSingleOutward=null;
    this.managePageIndex.endServiceTimeSingleOutward=null;
    this.managePageIndex.startServiceTimeSingleReturn=null;
    this.managePageIndex.endServiceTimeSingleReturn=null;
  }

  setSharedCache()
  {
   this.setService.fareBreakupModelData=this.fareBreakupModelData;
   this.setService.searchRequest=this.searchRequest;
   this.setService.isUserLoggedIn=this.isUserLoggedIn;
   //this.setService.evaluateRequest=this.evaluateRequest;

    this.setService.addReturnTabIndex= this.addReturnTabIndex;
  //   //this.mixingDeckUrl = this.sharedServiceCache.mixingDeckUrl;
  //   this.searchRequest = this.searchRequest;
  //   this.isAmendSearchOpen = this.isAmendSearchOpen;
  //   this.isAmendFresh = this.isAmendFresh;
    
  
  }


  resetFareBreakDownData()
  {
    if(this.fareBreakupModelData == undefined || this.fareBreakupModelData.length == 0){
      this.fareBreakupModelData =  new Array<FareBreakupModel>();
      var fareBreakdownModel = new FareBreakupModel;
      fareBreakdownModel.OutWardJourney = new Array<FareModel>();
      // fareBreakdownModel.ReturnJourney =new Array<FareModel>();
      // fareBreakdownModel.OutwardJourneyExtras =new Array<FareModel>();
      // fareBreakdownModel.ReturnJourneyExtras =new Array<FareModel>();
      // fareBreakdownModel.DeliveryDetails =new Array<FareModel>();
      // fareBreakdownModel.SeasonJourney = new FareModel();
      this.fareBreakupModelData[0] = fareBreakdownModel;
    }
   this.setService.addJourneyToBasketRequest=this.addJourneyToBasketRequest;
  
  }
  callMethodOfSecondComponent(params) { 
    this.invokeEvent.next(params);      
  }

 
}
