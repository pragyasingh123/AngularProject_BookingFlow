import { Injectable } from '@angular/core';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { RailCardModel } from '../models/journey/railcard.model';
import { JourneyFareDetails, JourneyResponse } from '../models/journey/search-services-response';
import { FareBreakupModel } from '../models/journey/fare-model';
import { ResponseData } from '../models/common/response';
import { AddJourneyToBasketRequest } from '../models/journey-extras/evaluate-journey-request';
import { AlertMessage } from '../models/common/alert-message';
import { ManagePageIndex } from '../models/journey/show-earlier-later-request';


export class SetAllservicesService {
  addReturnTabIndex:any;
  searchRequest: SearchRequestModel;
  isAmendSearchOpen:boolean=false;
  isAmendFresh: boolean;
  locations: LocationResponseData[];
  fare: any;
  isUserLoggedIn:boolean;
  loaderMessage: string;
  IsShowEarlierbuttonDisabledSingleOutward = false;
  IsShowLaterbuttonDisabledSingleOutward = false;
  IsShowEarlierbuttonDisabledSingleReturn = false;
  IsShowLaterbuttonDisabledSingleReturn = false;
  totalFare: number=0;
  railCards: RailCardModel[];
  
  //fareBreakupModes: Manage the Fare Breakup Mode S/R for Single and Return - Used in displaying the fare Breakup
  fareBreakupModes:string[]; 
  // fareBreakupModelData : Used to keep fare breakup details which is shown when user click on fare breakup icon on Mixing Deck Screen
  fareBreakupModelData: FareBreakupModel[];

  responseData  : ResponseData;
  addJourneyToBasketRequest : AddJourneyToBasketRequest;
  locationResponseData: LocationResponseData[];

  // managePageIndex : Used to Manage Show Earlier and Later DateTime to display records
  managePageIndex: ManagePageIndex;

  SharedSearchRequest : SearchRequestModel;
  AlertMessageBody : AlertMessage;
}

