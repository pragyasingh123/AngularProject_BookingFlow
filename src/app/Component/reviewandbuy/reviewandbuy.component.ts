import { Component, OnInit, Output } from '@angular/core';
import { ModifyQttSearchExpendedComponent } from '../mixing-deck/modify-qtt-search-expended/modify-qtt-search-expended.component';
import { MatDialog, MatRadioChange, MatSelectChange, MatCheckboxChange } from '@angular/material';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { ApplicableSeatAttributes, PreferenceGroups } from 'src/app/models/customer/seating-preference-response';
import { SeatPreferenceRequestModel } from 'src/app/models/customer/seat-preference-request';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { DeliveryMode, DeliveryOption, DeliveryModeRequest, DeliveryModeResponse } from 'src/app/models/delivery-modes/delivery-modes';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/Services/shared.service';
import { ReviewbuyJourneyDetail, JourneyInfo ,RemoveJourneyRequest,ReviewBuyResponse} from 'src/app/models/review-and-buy/reviewbuy-journey-detail';
import { Router } from '@angular/router';
import { UpdateUserSeatPreference } from 'src/app/models/customer/Update-Seat-Preference-Request';
import { AlertMessage } from 'src/app/models/common/alert-message';
import { UserSavedPreferences } from 'src/app/models/customer/user-saved-preferences-response';
import { element } from 'protractor';
import { ReviewBuyService } from 'src/app/Services/review-buy.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FareBreakupComponent } from 'src/app/fare-breakup/fare-breakup.component';
import { MixingDeckComponent } from '../mixing-deck/mixing-deck.component';
import { SeatReservationRequest } from 'src/app/models/review-and-buy/seat-reservation-request';
import { SessionExpiredComponent } from '../session-expired/session-expired.component';
import { map } from 'rxjs/operators';
import { SaveForLaterJourneyRequest } from 'src/app/models/journey-extras/save-journey';
import { SigninComponent } from '../signin/signin.component';
import { JourneyExtrasService } from 'src/app/Services/journey-extras.service';
import { BasketRequestRespose } from 'src/app/models/review-and-buy/journey-selected-response';
import { UsersSavedPreference } from 'src/app/models/review-and-buy/user-saved-preferences';
import { ConfirmationMessageComponent } from '../confirmation-message/confirmation-message.component';
import { NectarcardComponent } from './nectarcard/nectarcard.component';


@Component({
  selector: 'app-reviewandbuy',
  templateUrl: './reviewandbuy.component.html',
  styleUrls: ['./reviewandbuy.component.css']
})
export class ReviewandbuyComponent implements OnInit {
  public buttonName:any = 'Show Help ?';
  isShow = true;
  public show1:boolean = false;
  SeatPreferenceRequest: SeatPreferenceRequestModel;
  responseData : ResponseData;
  ApplicableSeatPreferenceGroup : any;
  ApplicableSeatPreferenceResponse : ApplicableSeatAttributes;
  ApplicableSeatAttributesModel : any;
  isJourneyReturn : boolean;
  searchRequestModel : SearchRequestModel;
  reviewBuyjourneyDetail:ReviewbuyJourneyDetail;
  Adults : number;
  Children : number;
  Railcards : number;
  Outbound : string;
  SourceStation : String;
  DestintationStation : String;
  splittedDate : string[];
  // sharedServiceData:SharedService;
  UserSeatPreferencesUpdateRequest : string[];
  IsOutwardOrReturnSelected : boolean;
  UpdateUserSeatPreferencesRequestModel : UpdateUserSeatPreference;
  SeatPreferenceString : string = '';
  IsUpdatePreferenecesToUserAccount : boolean = false;
  Facing : string = null;
  SeatType : string = null;
  Position : string = null;
  PrefferedCoach : string = null;
  NearTo : string =  null;
  AlertMessageBody : AlertMessage;
  GetUserSavedPreferencesRequest : string;
  GetUserSavedPreferencesResponse : UserSavedPreferences;
  GetUserSavedPrefValues: any;
  reviewBuyjourneyList: any;
  IsLoggedIn : boolean;
  //UserSavedPref : UserSavedPreferences[];
  IsOutwardChecked : boolean = true;
  IsReturnChecked : boolean = false;
  JourneyType : string;
  TotalJourneyCost : number;
  SeatReservationRequestModel : SeatReservationRequest;
  IsOutwardReservationMandatory : boolean ;
  IsReturnReservationMandatory : boolean ;
  IsReservationMandatory : boolean;
  saveForLaterJourneyRequest : SaveForLaterJourneyRequest;
  SaveForLaterFareGroupForMap : string[] = [];
  reviewBuyResponse: ReviewBuyResponse;
  //removeResponse: ReviewBuyResponse;
  removeJourneyRequest: RemoveJourneyRequest;
  SaveForLaterBasketRequestResponse: BasketRequestRespose;
  BasketRequestResponse : BasketRequestRespose[];
  UserSavedPref : UsersSavedPreference;
  ApplicableSeatAttribute : PreferenceGroups;
  deliveryResponse: DeliveryModeResponse;
  ReservationRequest : any;
  NoOfBicycles : number;
  NoOfBicyclesIterable : Array<number> = [];
  ReviewBuyPageDataRequest : any;
  constructor(private reviewBuyService: ReviewBuyService,private router:Router,public sharedService: SharedService,public datePipe : DatePipe,
    public sharedServiceStorage : StorageDataService, public sharedStorage : StorageDataService,
    public dialog: MatDialog, public customerService : CustomerServiceService, public journeyExtraService : JourneyExtrasService,
    public mixingDeck : MixingDeckComponent, public spinnerService : NgxSpinnerService, 
    private nectarCardComponent : NectarcardComponent) {

    this.SeatPreferenceRequest = new SeatPreferenceRequestModel();
    this.ApplicableSeatPreferenceResponse = new ApplicableSeatAttributes;
    this.ApplicableSeatAttributesModel = this.ApplicableSeatPreferenceResponse.applicableSeatGroups as PreferenceGroups[];
    this.UpdateUserSeatPreferencesRequestModel = new UpdateUserSeatPreference();
    this.GetUserSavedPreferencesResponse = new UserSavedPreferences();
    this.GetUserSavedPrefValues = [];
    this.isJourneyReturn = true;
    this.reviewBuyjourneyDetail =new ReviewbuyJourneyDetail();
    this.reviewBuyjourneyList = this.reviewBuyjourneyDetail.journeyList as JourneyInfo[];
    this.UserSeatPreferencesUpdateRequest = [];
    this.removeJourneyRequest = new RemoveJourneyRequest;
    this.AlertMessageBody = new AlertMessage();
    this.SeatReservationRequestModel= new SeatReservationRequest();
    this.UserSavedPref = new UsersSavedPreference();
    this.ReservationRequest = new SeatPreferenceRequestModel();
    if( localStorage.getItem("customerId")!=null)
    {
      this.IsLoggedIn = true;
    }
   }
  showhelp() {
    this.isShow = !this.isShow;
    this.show1 = !this.show1;
    if(this.show1)  
      this.buttonName = "Hide Help ?";
    else
      this.buttonName = "Show Help ?";
  }
  openQTTform($event){
   
    const dialogRef=this.dialog.open(ModifyQttSearchExpendedComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      panelClass: 'journeyDialog'
    });
    dialogRef.componentInstance.expendedSearchRequest = this.searchRequestModel;
  }

  OnClickOfChange()
    {
      this.sharedService.ShowSavedPref = !this.sharedService.ShowSavedPref
      this.sharedStorage.clearStorageData("storedAllServices");
      this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
    }
  
  OnClickOfClose()
  {
    this.sharedService.ShowSavedPref = true;
  }

  ngOnInit() {
   
    this.spinnerService.show();
    if(this.sharedStorage.getStorageData('storedAllServices', true)!=null)
    {
       this.sharedService=this.sharedStorage.getStorageData('storedAllServices', true);
       if(this.sharedService.ReviewBuyPageData != null)
       {
          //this.spinnerService.show();
          if(this.sharedService.ReviewBuyPageData.basketResult.reviewAndBuyBasketDetail.journeyList != null)
          {                           
            this.SetJourneyDetailData(this.sharedService.ReviewBuyPageData.basketResult.reviewAndBuyBasketDetail);  
          } 
          if(this.sharedService.ReviewBuyPageData.basketResult.reviewAndBuyBasketDetail.seatPreferences.applicableSeatGroups != null)
          {
            this.GetUserSavedPrefValues = this.sharedService.ReviewBuyPageData.basketResult.reviewAndBuyBasketDetail.seatPreferences.applicableSeatGroups.applicablePreferenceCodes;
            this.SetUserSavedPreferences(this.GetUserSavedPrefValues);
          }
         
         // this.spinnerService.hide();
       }
       else
       {
        //this.spinnerService.show();
        this.ReviewBuyPageDataRequest =  localStorage.getItem('sessioncode');
        this.reviewBuyService.getReviewBuyPageData(this.ReviewBuyPageDataRequest).subscribe(
          res=>{
               if(res!=null)
               {
                  this.responseData = res as ResponseData;
                  if(this.responseData.responseCode=='200')
                  {
                     var data = this.responseData.data;
                     this.sharedService.ReviewBuyPageData = data;
                     this.sharedStorage.clearStorageData("storedAllServices");
                     this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
                     localStorage.setItem("sessioncode",this.responseData.sessionCode);
                     if(data.basketResult.reviewAndBuyBasketDetail.journeyList != null)
                     {
                      this.deliveryResponse=data.deliveryOptions;
                      this.sharedService.NectarPointsEarned = data.basketResult.reviewAndBuyBasketDetail.nectarPointsEarned;
                      this.sharedService.TotalJourneyCost = data.basketResult.reviewAndBuyBasketDetail.totalCost;    
                      this.sharedStorage.clearStorageData("storedAllServices");
                      this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
                      this.nectarCardComponent.ngOnInit();
                      this.SetJourneyDetailData(data.basketResult.reviewAndBuyBasketDetail);
                     }
                     if(data.basketResult.reviewAndBuyBasketDetail.seatPreferences.applicableSeatGroups != null)
                     {
                      this.GetUserSavedPrefValues = data.basketResult.reviewAndBuyBasketDetail.seatPreferences.applicableSeatGroups.applicablePreferenceCodes;
                      this.SetUserSavedPreferences(this.GetUserSavedPrefValues);
                     }
                     if(data.nectarCardDetails.usernectarpoints != null)
                     {
                       this.sharedService.NectarCardData;
                     }
                    
                  }
               }
             });
             //this.spinnerService.hide();
        }       
     }

    setTimeout(() => {
      this.spinnerService.hide();
    }
      , 10000)
   
    this.searchRequestModel = this.sharedStorage.getStorageData('searchrequest', true);
    this.Adults = this.searchRequestModel.adults;
    this.Children = this.searchRequestModel.Children;
    this.Railcards = this.searchRequestModel.passengergroup.length;
    this.Outbound  = this.datePipe.transform(this.searchRequestModel.datetimedepart, 'full');
    this.splittedDate = this.Outbound.split(",",3);
    this.Outbound = this.splittedDate[0] + " " + this.splittedDate[1] + ", depart after " + this.splittedDate[2].substring(9,14);
    this.SourceStation  = this.searchRequestModel.ArrivalLocationName;
    this.DestintationStation = this.searchRequestModel.DepartureLocationName;
   
  }

  SetJourneyDetailData(JourneyDetailData)
  {
    this.reviewBuyjourneyDetail= JourneyDetailData;          
           
    if(this.reviewBuyjourneyDetail.journeyList != null)
    {
      this.reviewBuyjourneyList=this.reviewBuyjourneyDetail.journeyList;              
      this.reviewBuyjourneyDetail.journeyList .forEach(element => {
        if(element.tickteList != null)
        {
          if(element.tickteList.length == 1 && element.tickteList[0].journeyDirection =='O')
          {
            element.JourneyTypeList = ['Outward'];
            if(element.tickteList[0].isReservationMandatory == 'N')
               element.IsOutwardReservationMandatory = false;
            else
            {
              element.IsOutwardReservationMandatory = true;
              this.sharedService.ShowSavedPref = false;
            }
              
          }
         
          else if(element.tickteList.length == 2)
          {
              element.JourneyTypeList = ['Outward', 'Return'];
              this.IsReturnChecked =true;
              if(element.tickteList[0].isReservationMandatory == 'N' && element.tickteList[1].isReservationMandatory == 'N')
              {
                element.IsOutwardReservationMandatory = false; 
                element.IsReturnReservationMandatory= false;                     
              }                
             else if(element.tickteList[0].isReservationMandatory == 'Y' && element.tickteList[1].isReservationMandatory == 'Y')                    
              {
                element.IsOutwardReservationMandatory = true;
                element.IsReturnReservationMandatory= true;  
                this.sharedService.ShowSavedPref = false;
              }
              else
              {
                if(element.tickteList[0].isReservationMandatory == 'N' && element.tickteList[1].isReservationMandatory == 'Y')
                {
                  element.IsOutwardReservationMandatory = false;
                  element.IsReturnReservationMandatory= true;  
                  this.sharedService.ShowSavedPref = false;                     
                } 
                else if(element.tickteList[0].isReservationMandatory == 'Y' && element.tickteList[1].isReservationMandatory == 'N')
                {
                  element.IsOutwardReservationMandatory = true;
                  element.IsReturnReservationMandatory= false;  
                  this.sharedService.ShowSavedPref = false;                       
                }  
              }                
            }
          
         
        }
        element.MaxBicycleToBeReserved = [];
        element.MaxBicycleToBeReserved.length = element.noOfAdults + element.noOfChildren;     
        this.ApplicableSeatAttributesModel = element.seatAttributes.applicableSeatGroups;
        
        if(this.ApplicableSeatAttributesModel.length > 0)
        {                      
          this.ApplicableSeatAttributesModel.forEach(applicableseats => {
              var IsPrefUpdated = false;
              if(this.sharedService.UsersSavedPreferenceShared.length != 0)
              {
                this.sharedService.UsersSavedPreferenceShared.forEach(savedpref => {
                  if(savedpref.PrefType == applicableseats.groupType)
                  {
                    applicableseats.applicablePreferenceCodes.forEach(pref => {
                      if(savedpref.PrefValue == pref.prefCode)
                      {
                        pref.IsUserPref = true;
                        IsPrefUpdated = true;
                      }
                      else 
                      {
                        pref.IsUserPref = false;
                      }

                    });
                  }
                  if(IsPrefUpdated == true)
                  {
                    return;
                  }
                });
                if(IsPrefUpdated == false)
                {
                  applicableseats.applicablePreferenceCodes.forEach(obj => {
                    if(obj.prefCode == '0')
                    {
                      obj.IsUserPref = true;
                    }
                    else
                    {
                      obj.IsUserPref = false;
                    }
                  });
                }
              }  
              else
              {
                applicableseats.applicablePreferenceCodes.forEach(obj => {
                  if(obj.prefCode == '0')
                  {
                    obj.IsUserPref = true;
                  }
                  else
                  {
                    obj.IsUserPref = false;
                  }
                });
              }                                         
             });
        }
     element.SeatPreferences = this.ApplicableSeatAttributesModel;
     this.sharedService.reviewBuyjourneyResponseDetail = this.reviewBuyjourneyDetail;
     this.sharedStorage.clearStorageData("storedAllServices");
     this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
     });
   }
}

  SetUserSavedPreferences(GetUserSavedPrefValues)
  {
    GetUserSavedPrefValues.forEach(element => {
      if(element.prefvalue == 'BACK' || element.prefvalue == 'FACE')
      {
        this.UserSavedPref.PrefType = 'Facing';
        this.UserSavedPref.PrefValue = element.prefvalue;
        this.sharedService.UsersSavedPreferenceShared.push(this.UserSavedPref);
      }                           
      else if(element.prefvalue == 'AISL' || element.prefvalue == 'WIND')
      {
        this.UserSavedPref.PrefType = 'Position';
        this.UserSavedPref.PrefValue = element.prefvalue;
        this.sharedService.UsersSavedPreferenceShared.push(this.UserSavedPref);
      }                           
      if(element.prefvalue == 'AIRL' || element.prefvalue == 'INDL' || element.prefvalue == 'TABL')
      {
        this.UserSavedPref.PrefType = 'Seat Type';
        this.UserSavedPref.PrefValue = element.prefvalue;
        this.sharedService.UsersSavedPreferenceShared.push(this.UserSavedPref);
      }                        
      if(element.prefvalue == 'QUIE')
      {
        this.UserSavedPref.PrefType = 'PrefferedCoach';
        this.UserSavedPref.PrefValue = element.prefvalue;
        this.sharedService.UsersSavedPreferenceShared.push(this.UserSavedPref);
      }       
      if(element.prefvalue == 'CNTR' || element.prefvalue == 'ENDS' || element.prefvalue == 'NRWC')
      {
        this.UserSavedPref.PrefType = 'NearTo';
        this.UserSavedPref.PrefValue = element.prefvalue;
        this.sharedService.UsersSavedPreferenceShared.push(this.UserSavedPref);
      } 
    });
    this.sharedService.GetUserSavedPrefValuesAPIResponse = this.GetUserSavedPrefValues;         
    this.sharedStorage.clearStorageData("storedAllServices");
    this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
   
  }

  OnCheckBicycleReservationBox(event, JourneyDetail)
  {
    if(event.checked == true)
    {
      JourneyDetail.IsBicycleReservationChecked = true;
    }
  }
  OnCheckJourneyExtra(event, JourneyExtra)
  {
    if(event.checked == true)
    {
      this.sharedService.TotalJourneyCost = this.sharedService.TotalJourneyCost +  JourneyExtra.totalCostAllPassengers;
    }
  }

  
  openfarebreakup() {
    this.dialog.open(FareBreakupComponent,{
      disableClose: false,
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '900px',
      panelClass: 'fare-breakup-popup',
    });
  }

  addNewJourney(){
    
    localStorage.setItem("isRequestFromAnotherUrl","true");
    
    this.sharedService.isAmendSearchOpen = true;
    this.sharedStorage.clearStorageData("storedAllServices");
    this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
    this.router.navigate([`./mixingdeck`]);
    
  }

  OnClickSaveForLater(JourneyDetail)
  {
    localStorage.setItem('SaveForLaterTripNo', String(JourneyDetail.tripNo));
    if(localStorage.getItem("customerId")==null){
      const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        maxWidth: '90%',
        maxHeight: '90vh',
        width: '400px',
        panelClass: 'delete-popup',
        data:{
          message: 'In order to save your search, please login to your SWR account. Click continue to Login.',
          isLoggedIn: false
        }
      });
      dialogRef.afterClosed().subscribe(res=>{
        if(res.data)
        {
          let dialog= this.dialog.open(SigninComponent,{
            disableClose: false,
            maxWidth: '80vw',
            maxHeight: '90vh',
            width: '600px',
            panelClass: 'sigin-in-popup'
          });
          dialog.afterClosed().subscribe(res =>{
            if(localStorage.getItem('email') !=null && localStorage.getItem('customerId')!=null)
            {
              this.setJourneyForLater();
              this.sharedService.saveForLaterJourneyRequest = this.saveForLaterJourneyRequest;
              this.addJourneyForLater();
            }
          });
        }
      });
    }
    else{
      this.setJourneyForLater();
      this.sharedService.saveForLaterJourneyRequest = this.saveForLaterJourneyRequest;
      this.addJourneyForLater();      
    }
  }

  
  setJourneyForLater()
    {
     this.SaveForLaterBasketRequestResponse= new BasketRequestRespose();
     var selectedTripNo = Number(localStorage.getItem('SaveForLaterTripNo'));
     this.BasketRequestResponse = this.sharedServiceStorage.getStorageData('BasketRequestResponseForReviewBuy', true); 
     this.BasketRequestResponse.forEach(element => {
       if(element.tripNumber == selectedTripNo)
       {
         this.SaveForLaterBasketRequestResponse = element;
       }
       });
      this.saveForLaterJourneyRequest = new SaveForLaterJourneyRequest();
      if(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.returnFareGroup == null)
        {
          this.saveForLaterJourneyRequest.outwardfaregroupid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.outwardFareGroup);
          this.saveForLaterJourneyRequest.outwardserviceid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.outwardserviceid);
          this.saveForLaterJourneyRequest.sessionid = localStorage.getItem("sessioncode");
        }
      else
        {
          this.saveForLaterJourneyRequest.outwardfaregroupid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.outwardFareGroup);
          this.saveForLaterJourneyRequest.outwardserviceid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.outwardserviceid);
          this.saveForLaterJourneyRequest.returnfaregroupid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.returnFareGroup);
          this.saveForLaterJourneyRequest.returnserviceid = Number(this.SaveForLaterBasketRequestResponse.addjourneyToBasketRequest.returnserviceid);
          this.saveForLaterJourneyRequest.sessionid = localStorage.getItem("sessioncode");
        }   
    }
  
    addJourneyForLater(){
      this.journeyExtraService.saveJourneyForLater(this.saveForLaterJourneyRequest).subscribe(
        res=>{
          if(res!=null){
            this.responseData = res as ResponseData;
            if(this.responseData.responseCode=='200'){
              var data = this.responseData.data;
              if(data.rhresponse.errors == null)
              {
                this.dialog.open(ConfirmationMessageComponent, {
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  width: '400px',
                  panelClass: 'delete-popup',
                  data:{
                    message: 'Your journey is successfully saved',
                    isLoggedIn: true
                  }
                });
              }
              if(data.rhresponse.errors != null)
              {
                this.dialog.open(ConfirmationMessageComponent, {
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  width: '400px',
                  panelClass: 'delete-popup',
                  data:{
                    message: 'Your journey could not ne saved due to some internal error. Please try again.'  ,                
                    isLoggedIn: true
                  }
                  });
              }
            }
          }
        }
      )
    }
  
    onBicycleCountClick(event : MatSelectChange)
  {
 
      this.NoOfBicycles = event.value;
    
  }


  onJourneyTypeChange(event: MatCheckboxChange, journeyType)
  {
   if(event.checked == true && journeyType == 'Outward')
   {
    this.IsOutwardChecked = true;
   }
   else if(event.checked == false && journeyType == 'Outward')
   {
    this.IsOutwardChecked = false;
   }
   if(event.checked == true && journeyType == 'Return')
   {
    this.IsReturnChecked = true;
   }
   else if(event.checked == false && journeyType == 'Return')
   {
    this.IsReturnChecked = false;
   }
  }

  onPrefChange(event, data) {
    console.log(data);
    if(data == 'BACK' || data == 'FACE')
      this.Facing = data;
    else  if(data == 'AISL' || data == 'WIND')
      this.Position = data; 
    else if(data == 'AIRL' || data == 'INDL' || data == 'TABL')
      this.SeatType = data;
    else if(data == 'QUIE')
      this.PrefferedCoach = data;
    else if(data == 'CNTR' || data == 'ENDS' || data == 'NRWC')
      this.NearTo = data;

  }

  onClickUpdatePreference(eventChecked)
  {
    if(eventChecked == true)
      this.IsUpdatePreferenecesToUserAccount = true;
    else
      this.IsUpdatePreferenecesToUserAccount = false;
  }

  
  onClickUpdate(JourneyDetail)
  {
    this.spinnerService.show();
    if(this.Position != null)
      this.UserSeatPreferencesUpdateRequest.push(this.Position);
    if(this.SeatType != null)
      this.UserSeatPreferencesUpdateRequest.push(this.SeatType);
    if(this.PrefferedCoach != null)
      this.UserSeatPreferencesUpdateRequest.push(this.PrefferedCoach);
    if(this.NearTo != null)
      this.UserSeatPreferencesUpdateRequest.push(this.NearTo);
    if(this.Facing != null)
      this.UserSeatPreferencesUpdateRequest.push(this.Facing);
    
    if(this.IsOutwardChecked == false && this.IsReturnChecked == false)
    {
          this.SeatReservationRequestModel.reserveInward = 0;
          this.SeatReservationRequestModel.reserveOutward = 0;
          this.SeatReservationRequestModel.seatPreferences = [];//this.UserSeatPreferencesUpdateRequest;
    }
    else if(this.IsOutwardChecked == true && this.IsReturnChecked == true)
    {
      this.SeatReservationRequestModel.reserveInward = 1;
      this.SeatReservationRequestModel.reserveOutward = 1;
      this.SeatReservationRequestModel.seatPreferences =this.UserSeatPreferencesUpdateRequest;
    }
    else 
    {
      if(this.IsOutwardChecked == true && this.IsReturnChecked == false)
       {
          this.SeatReservationRequestModel.reserveOutward = 1;
          this.SeatReservationRequestModel.reserveInward = 0;
          this.SeatReservationRequestModel.seatPreferences = this.UserSeatPreferencesUpdateRequest;
       }
       else
       {
         this.SeatReservationRequestModel.reserveInward = 1;
         this.SeatReservationRequestModel.reserveOutward = 0;
         this.SeatReservationRequestModel.seatPreferences = this.UserSeatPreferencesUpdateRequest;
       }
    }
   
    this.SeatReservationRequestModel.tripNo = String(JourneyDetail.tripNo);
    if(JourneyDetail.IsBicycleReservationChecked == true)
    {
      this.SeatReservationRequestModel.numberOfBicycles = this.NoOfBicycles;
    }
    
    this.SeatReservationRequestModel.numberOfWheelChairs = 0;
    this.SeatReservationRequestModel.bicycleReservationsOnly = 0;
    this.SeatReservationRequestModel.sessionid = localStorage.getItem('sessioncode');
    // Make Seat Reservation
    this.reviewBuyService.makeSeatReservation(this.SeatReservationRequestModel).subscribe(
      res=>{
        this.responseData = res as ResponseData;
        if(this.responseData.responseCode == '200')
          {
            var data = this.responseData.data;
            localStorage.setItem('sessioncode', this.responseData.sessionCode);
            if(data.rhResponse.errors != null) //Just to Show what happens when reservation Not Found
            {
              this.AlertMessageBody.isAlertMessage = true;
              this.AlertMessageBody.IsLoginRequest = false;
              this.AlertMessageBody.alertMessage = "Sorry, we are not able to reserve your seat(s). Please choose different seat preference(s) or remove the journey.";
              
            } 
            else if(data.rhResponse.errors == null && data.seatReservations.seatPlaces.length == 0)  //Just to Show what happens when reservation Not Found
            {
              this.AlertMessageBody.isAlertMessage = true;
              this.AlertMessageBody.IsLoginRequest = false;
             // this.sharedService.IsSeatReservationData = true;   
              this.AlertMessageBody.alertMessage = "Sorry, seat reservation is not available for this Journey. Please proceed without reserving your seat(s).";
              
            } 
            else if(data.seatReservations.seatPlaces.length > 0)
            {
              this.sharedService.ReservedSeatData = data.seatReservations.seatPlaces;
              this.sharedService.IsSeatReservationData = true;                          
            }                          
            this.sharedServiceStorage.setStorageData('alertMessageBody', this.AlertMessageBody, true);
            
            let dialog= this.dialog.open(SessionExpiredComponent, {
                maxWidth: '95vw',
                maxHeight: '95vh',
                width: '600px',
                panelClass: 'session-expired'
              });
             dialog.afterClosed().subscribe(res =>{
              this.sharedService.ShowSavedPref = !this.sharedService.ShowSavedPref;
              });
          }
      }
    );

    // Update Seat Preferences in User's Account
    if((this.IsUpdatePreferenecesToUserAccount == true))
    {
      if(this.UserSeatPreferencesUpdateRequest !=null)
       {
        this.SeatPreferenceString= this.UserSeatPreferencesUpdateRequest.join(", ");
        this.UpdateUserSeatPreferencesRequestModel.sessionid = localStorage.getItem('sessioncode'); 
        this.UpdateUserSeatPreferencesRequestModel.seatcodes = this.SeatPreferenceString;
        this.customerService.updateUserSeatPreferences(this.UpdateUserSeatPreferencesRequestModel).subscribe(
          res=>{
            this.responseData = res as ResponseData;
            if(this.responseData.responseCode == '200')
              {
                console.log("updateUserSeatPreferences",this.responseData.sessionCode);
                var data = this.responseData.data;
                localStorage.setItem('sessioncode', this.responseData.sessionCode);
                if(data.rhresponse.errors == null)
                {
                  //show message of update.
                  this.AlertMessageBody.isAlertMessage = true;
                  this.AlertMessageBody.IsLoginRequest = false;                    
                  this.AlertMessageBody.alertMessage = "Seat Preferences updated successfully!!";
                  
                }    
                else
                {
                  //show message of error.
                  this.AlertMessageBody.isAlertMessage = true;
                  this.AlertMessageBody.IsLoginRequest = false;                    
                  this.AlertMessageBody.alertMessage = "Seat Preferences could not be Saved due to some internal application error. Please try after some time.";
                  this.sharedServiceStorage.setStorageData('alertMessageBody', this.AlertMessageBody, true);          
                  let dialog= this.dialog.open(SessionExpiredComponent, {
                    maxWidth: '95vw',
                    maxHeight: '95vh',
                    width: '600px',
                    panelClass: 'session-expired'
                  });
                 dialog.afterClosed().subscribe(res =>{
                  this.sharedService.ShowSavedPref = !this.sharedService.ShowSavedPref;
                  });
                }     
                this.UserSeatPreferencesUpdateRequest = [];
              }
            }
           );
          
        }
    }
    //this.sharedService.ShowSavedPref = !this.sharedService.ShowSavedPref;
    this.sharedStorage.clearStorageData("storedAllServices");
    this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
    this.spinnerService.hide();
  }

  removeJourney(tripNo) {
    


    //this.reviewBuyjourneyDetail.journeyList=this.reviewBuyjourneyDetail.journeyList.filter(m => m.tripNo != 1);
               
              
                 this.removeJourneyRequest.tripNo = tripNo;
                 this.reviewBuyService.removejourney(this.removeJourneyRequest,localStorage.getItem('sessioncode')).subscribe(
       res => {
         if (res != null) {
           this.responseData = res as ResponseData;
           if (this.responseData.responseCode == '200') {
             this.reviewBuyResponse = this.responseData.data;
             localStorage.setItem('sessioncode', this.responseData.sessionCode);
            //this.sharedService.getBasketCount.emit(this.removeResponse.BasketCount);
            this.reviewBuyjourneyDetail.journeyList = this.reviewBuyjourneyDetail.journeyList.filter(m => m.tripNo != tripNo);
              if (this.reviewBuyjourneyDetail.journeyList.length == 0) {

                    localStorage.setItem("isRequestFromAnotherUrl","true");
                    this.sharedService.isAmendSearchOpen = true;
                    this.sharedStorage.clearStorageData("storedAllServices");
                   this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
                   this.router.navigate([`./mixingdeck`]);
               }
            
             else {
              this.reviewBuyjourneyDetail.journeyList = this.reviewBuyjourneyDetail.journeyList.filter(m => m.tripNo != tripNo)
             }
           console.log(this.responseData.ResponseMessage);
           //this.getJourneyDetail();
         }
       }
  
 });
  
}

}
