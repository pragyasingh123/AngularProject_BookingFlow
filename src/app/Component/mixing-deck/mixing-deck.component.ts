import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ModifyQttSearchExpendedComponent } from './modify-qtt-search-expended/modify-qtt-search-expended.component';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReturnSearchResultComponent } from './return-search-result/return-search-result.component';
import { SharedService } from 'src/app/Services/shared.service';
import { SetAllservicesService } from 'src/app/Services/set-allservices.service';
import { RailCardModel } from 'src/app/models/journey/railcard.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchSolutionService } from 'src/app/Services/search-solution.service';
import { ResponseData } from 'src/app/models/common/response';
import { JourneyResponse } from 'src/app/models/journey/search-services-response';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';
import { CommonServiceService } from 'src/app/Services/common-service.service';
import * as moment from 'moment';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { FareBreakupComponent } from 'src/app/fare-breakup/fare-breakup.component';
import { AddJourneyToBasketRequest } from 'src/app/models/journey-extras/evaluate-journey-request';
import { JourneyExtrasService } from 'src/app/Services/journey-extras.service';
import { SigninComponent } from 'src/app/Component/signin/signin.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveForLaterJourneyRequest } from 'src/app/models/journey-extras/save-journey';
import { ConfirmationMessageComponent } from '../confirmation-message/confirmation-message.component';
import { BasketRequestRespose } from 'src/app/models/review-and-buy/journey-selected-response';
import { ApplicationConstants } from 'src/app/models/Constants/constants.model';

@Component({
  selector: 'app-mixing-deck',
  templateUrl: './mixing-deck.component.html',
  styleUrls: ['./mixing-deck.component.css']
})
export class MixingDeckComponent implements OnInit {
  responseData: ResponseData;
  journeyResponse: JourneyResponse[];
  dataSource = this.journeyResponse;
  locations: LocationResponseData[];
  journeyType: string;
  basketResponse:BasketRequestRespose;
  passengerDetailLabel: string;
  searchRequest: SearchRequestModel;
  public isShowtooltip = false;
  public show1:boolean = false;
  public buttonName:any = 'Show Help ?';
  isReturnJourney:boolean = false;
  parentData: string;
  addJourneyToBasketRequest : AddJourneyToBasketRequest;
  sessionID : string;
  saveForLaterJourneyRequest : SaveForLaterJourneyRequest;
  BasketRequestResponseForReviewBuy : BasketRequestRespose[];
  @ViewChild("SearchResultReturnList", { static: false }) searchResultReturnList: ReturnSearchResultComponent;
  @ViewChild("SearchResultList", { static: false }) searchResultList: SearchResultComponent;


  
  constructor(public sharedService: SharedService,public setService:SetAllservicesService,public dialog: MatDialog, private route:ActivatedRoute,private commonServices: CommonServiceService, private searchSolutionService:SearchSolutionService,
    private storageDataService:StorageDataService, private journeyExtraService: JourneyExtrasService, private router: Router) {
    this.searchRequest = new SearchRequestModel();
    this.searchRequest.passengergroup = new Array<RailCardModel>();
    this.responseData=new ResponseData();
    this.journeyResponse= new Array<JourneyResponse>();
   }
   openConfirmationPopup()
   {
     this.dialog.open(ConfirmationMessageComponent, {
       maxWidth: '90%',
       maxHeight: '90vh',
       width: '400px',
       panelClass: 'delete-popup'
     });
   }

  ngOnInit() {   
   
 debugger
if(this.storageDataService.getStorageData('storedAllServices', true)!=null){

  this.sharedService=this.storageDataService.getStorageData('storedAllServices', true);
  if(!this.sharedService.isRequestFromAnotherUrl){
    this.storageDataService.clearStorageData("storedAllServices");
  }
}

 this.sharedService.isAmendFresh = true;
    this.setService.isAmendFresh=true;
    
    if (this.sharedService.isAmendSearchOpen) {
      debugger
      //this.searchRequest = this.sharedService.searchRequest;
      this.searchRequest=this.storageDataService.getStorageData('searchrequest', true);
      this.sharedService.DestinationStation = String(this.searchRequest.ArrivalLocationName);
      this.sharedService.SourceStation = String(this.searchRequest.DepartureLocationName);
      this.openmyDialog();
    }
    else {
      this.getQueryString();
    }
  }
  getFilters(_filters : any){
    _filters.forEach(element => {
      if(element.StandardClass != null && element.StandardClass == true){
        this.searchRequest.standardClass = "1";
      }
      if(element.FirstClass != null && element.FirstClass == true){
        this.searchRequest.firstclass = "1";
      }
      if(element.ITSOSmartCard != null && element.ITSOSmartCard == true){
        
      }    
    });
    this.searchResultList.getTravelSolutions();
  }
 
RetunGetNextDayJourney(_datetimereturn:any,_date:any)
{
  this.searchResultList.onClickGetNextDaySearch(_datetimereturn,_date);
}
  GetNextDayJourney(_date: any,_datetimereturn:any)
  {
   if(localStorage.getItem('newReturndate')!=null)
     {
     _datetimereturn=new Date(localStorage.getItem('newReturndate'));
      this.searchResultList.onClickGetNextDaySearch(_date,_datetimereturn)
    }
     else
     {
    _datetimereturn=null
      this.searchResultList.onClickGetNextDaySearch(_date,_datetimereturn)
     }
// debugger;
  }
  GetPreviousDayJourney(_datePrevious: any)
  {
    this.searchResultList.onClickGetPreviousDaySearch(_datePrevious)
// debugger;
  }
  GetTravelSolutions(_getTravel: any)
  {
    this.searchResultList.getTravelSolutions()
// debugger;
  }
  showhelp()
  {
    this.isShowtooltip = !this.isShowtooltip;
    this.show1 = !this.show1;
    if(this.show1)  
      this.buttonName = "Hide Help ?";
    else
      this.buttonName = "Show Help ?";
  }
  openmyDialog(){
    const dialogRef=this.dialog.open(ModifyQttSearchExpendedComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
     panelClass: 'journeyDialog'
    });
    
    dialogRef.componentInstance.expendedSearchRequest = this.searchRequest;

    dialogRef.afterClosed().subscribe(res => {
      //console.log(res.data)                          // received data from expendedqtt-component

      if (res) {
             this.searchRequest = res;
             this.passengerDetailLabel = this.searchRequest.adults + (this.searchRequest.adults > 1? " adults " : " adult ") + (this.searchRequest.adults > 0 ? "and " + this.searchRequest.Children + (this.searchRequest.Children > 1? " children ": " child ") : "");
           
             if(res.TravelSolutionDirection == "ONE_WAY"){
               this.journeyType = "Single";
               this.isReturnJourney = false;             
      
             }
             else if(res.TravelSolutionDirection == "RETURN"){
               this.journeyType = "Return";
               this.isReturnJourney=true;
             }
             
             else {
               this.journeyType = "Open-Return";
               
               this.isReturnJourney = false;
             }

             this.searchRequest.oneway = (this.journeyType == "Single")?"1":"0";
           this.searchRequest.openreturn = (this.journeyType =='Open-Return')?"1":"0";
             this.searchResultList.ngOnInitFunction();
           }
           
           
          //  if(res.TravelSolutionDirection == "RETURN"){
          //    //this.searchResultReturnList.ngOnInit();
          //    this.searchResultList.ngOnInitFunction();
          //  }
          //  else {
             // this.searchResultList.ngOnInitFunction();

          //  }
    });
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

  getQueryString(){
   
    this.route.queryParamMap.subscribe(params=>{
      this.searchRequest.locfrom = params.get("oriCode");
      this.searchRequest.locto = params.get("destCode");
      this.searchRequest.DepartureLocationName=params.get("oriName");
      this.sharedService.SourceStation = String(this.searchRequest.DepartureLocationName);
      this.searchRequest.ArrivalLocationName=params.get("destName");
      this.sharedService.DestinationStation = String(this.searchRequest.ArrivalLocationName);
      this.searchRequest.adults = Number(params.get("noa"));
      this.searchRequest.Children = Number(params.get("noc"));
      this.journeyType = params.get("jt");
      this.searchRequest.IsReturnRequest = (this.journeyType =="Return")?true:false;
      this.searchRequest.oneway = (this.journeyType == "Single")?"1":"0";
      this.searchRequest.openreturn = (this.journeyType =='Open-Return')?"1":"0";
      this.searchRequest.datetimedepart=params.get("departDate");

      if(this.journeyType=="Single")
      {
        this.searchRequest.TravelSolutionDirection="ONE_WAY";
        this.searchRequest.IsReturnRequest = false;
      }

      if(this.journeyType=="Open-Return")
      {
        this.searchRequest.TravelSolutionDirection="OPEN_RETURN";
        this.searchRequest.IsReturnRequest = false;
      }

       if (params.get("oadInd") === 'Leave After') {
          this.searchRequest.outwarddepartafter = "1";
          this.searchRequest.Traveltype="DEPARTAFTER";
        }
      else {
        this.searchRequest.outwarddepartafter = "0";
        this.searchRequest.Traveltype="ARRIVEBY";
      }
      
      if (this.journeyType == 'Return') {
        this.isReturnJourney = true; 
        this.searchRequest.TravelSolutionDirection="RETURN";
        
         this.searchRequest.datetimereturn = params.get("returnDate");
        if (params.get("oadIndReturn") === 'Leave After') {
          this.searchRequest.returndepartafter = "1";
          this.searchRequest.TraveltypeReturn = "DEPARTAFTER";
        
        }
        else {
          this.searchRequest.returndepartafter = "0";
          this.searchRequest.TraveltypeReturn = "ARRIVEBY";
        }
      }
      
      this.searchRequest.enquiryMethod = 'MixingDeck';
      this.searchRequest.showservices="0";
      this.searchRequest.firstclass="0";
      this.searchRequest.isseasonticket="0";
      this.searchRequest.directServicesOnly ="0";
      this.searchRequest.standardClass="1";
      this.passengerDetailLabel = this.searchRequest.adults + (Number(this.searchRequest.adults) > 1? " adults " : " adult ") + (Number(this.searchRequest.Children) > 0 ? "and " + this.searchRequest.Children + (Number(this.searchRequest.Children) > 1? " children ": " child ") : "");
      let rCount = +params.get('rCount');
      let totaladults=this.searchRequest.adults;
      let totalChildren=this.searchRequest.Children;
      for(let i = 0; i < rCount; i++ ){
        let railcard = new RailCardModel;
        railcard.RailCardCode = params.get('rcCode'+ (i+1).toString());
        railcard.adults = Number(params.get('rcNoa'+ (i+1).toString()));
        railcard.Children = Number(params.get('rcNoc'+ (i+1).toString()));
        railcard.numberofrailcards = Number(params.get('rcNum'+ (i+1).toString()));
        totaladults=totaladults-railcard.adults;
        totalChildren=totalChildren-railcard.Children;
        this.searchRequest.passengergroup.push(railcard);
      }
      if((totalChildren>0 || totaladults>0) && rCount !=0){
        let railcard = new RailCardModel;
        railcard.adults=totaladults;
        railcard.Children=totalChildren;
        railcard.numberofrailcards=0;
        railcard.RailCardCode="";
        this.searchRequest.passengergroup.push(railcard);

      }
      if(rCount==0){
        let railcard = new RailCardModel;
        railcard.adults=this.searchRequest.adults;
        railcard.Children=this.searchRequest.Children;
        railcard.numberofrailcards=0;
        railcard.RailCardCode="";
        this.searchRequest.passengergroup.push(railcard);
      }

      this.searchRequest.railcardscount=rCount;
      this.searchRequest.railcardscountReturn=rCount;
      this.searchRequest.railcardscountOpenreturn=rCount;
  
      
      this.sharedService.searchRequest=this.searchRequest;
      this.searchRequest.sessionid= localStorage.getItem('sessioncode');
      this.storageDataService.setStorageData("searchrequest", this.searchRequest, true);
      this.storageDataService.clearStorageData(ApplicationConstants.StoredAllServices);
      this.storageDataService.setStorageData(ApplicationConstants.StoredAllServices,this.sharedService,true);              
           
    }
    
  )};


  onChangeStationsSearch() {
    var arrivalLocation = this.searchRequest.locto;
    var arrivalLocationName = this.searchRequest.ArrivalLocationName;
    this.searchRequest.locto = this.searchRequest.locfrom;
    this.searchRequest.locfrom = arrivalLocation;
    this.searchRequest.ArrivalLocationName = this.searchRequest.DepartureLocationName;
    this.searchRequest.DepartureLocationName = arrivalLocationName;
    if (this.searchRequest.IsReturnRequest) {
      this.searchResultReturnList.ngOnInit();
    }
    else {
      this.searchResultList.ngOnInitFunction();
    }
  }
  openJourneyExtra(){
      this.setTravelSolution();
      this.sharedService.addJourneyToBasketRequest = this.addJourneyToBasketRequest;
      this.getEvaluateData();
  }

  setTravelSolution(){
    this.addJourneyToBasketRequest = new AddJourneyToBasketRequest();

    if(this.searchRequest.IsReturnRequest){
      if(this.searchResultReturnList.outwardServiceId!=undefined){
        this.addJourneyToBasketRequest.outwardserviceid = this.searchResultReturnList.outwardServiceId;
        this.addJourneyToBasketRequest.outwardFareGroup = this.searchResultReturnList.outwardFareGroup;
        this.addJourneyToBasketRequest.returnserviceid = this.searchResultReturnList.returnServiceId;
        this.addJourneyToBasketRequest.returnFareGroup = this.searchResultReturnList.returnFareGroup;
        this.addJourneyToBasketRequest.sessionid = localStorage.getItem("sessioncode");
      }
      else{
        this.addJourneyToBasketRequest.outwardserviceid = this.searchResultList.selectedJourneyResponse.serviceId;
        this.addJourneyToBasketRequest.outwardFareGroup = this.searchResultList.selectedFare.fareGroupId;
        this.addJourneyToBasketRequest.returnserviceid = this.searchResultReturnList.returnServiceId;
        this.addJourneyToBasketRequest.sessionid = localStorage.getItem("sessioncode");
      }
    }
    else{
      this.addJourneyToBasketRequest.outwardserviceid = this.searchResultList.selectedJourneyResponse.serviceId;
      this.addJourneyToBasketRequest.outwardFareGroup = this.searchResultList.selectedFare.fareGroupId;
      this.addJourneyToBasketRequest.sessionid = localStorage.getItem("sessioncode");
    }

      
  }

  getEvaluateData(){
    this.basketResponse= new BasketRequestRespose();
    this.BasketRequestResponseForReviewBuy = new Array<BasketRequestRespose>();
    this.basketResponse.addjourneyToBasketRequest=this.addJourneyToBasketRequest;
    this.journeyExtraService.getEvaluateJourney(this.addJourneyToBasketRequest).subscribe(
      res=>{
        if(res!=null){
          this.responseData = res as ResponseData;
          if(this.responseData.responseCode=='200'){
            var data = this.responseData.data;
            this.storageDataService.setStorageData("BuyNowData", this.responseData, true);
            localStorage.setItem("sessioncode",this.responseData.sessionCode);
            if(data.addtriptobasketresponse.rhresponse.errors != null)
            {
              // Do Something when there is error in Basket POST API
            }
            else{
              localStorage.removeItem("");
              this.router.navigate([`./reviewbuy`]);
              this.basketResponse.tripNumber=data.addtriptobasketresponse.addtriptobasketresult.tripno;
              this.sharedService.BasketRequestResponse.push(this.basketResponse);
              if(this.storageDataService.getStorageData('BasketRequestResponseForReviewBuy', true) != null)
              {
                this.BasketRequestResponseForReviewBuy = this.storageDataService.getStorageData('BasketRequestResponseForReviewBuy', true);            
              }
              this.BasketRequestResponseForReviewBuy.push(this.basketResponse);
              this.storageDataService.setStorageData('BasketRequestResponseForReviewBuy', this.BasketRequestResponseForReviewBuy, true);
              this.storageDataService.clearStorageData(ApplicationConstants.StoredAllServices);
              this.storageDataService.setStorageData(ApplicationConstants.StoredAllServices,this.sharedService,true);              
            }
            
          }
        }
      }
    )
  }

  saveJourneyForLater(){
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
        if(res.data){
          let dialog= this.dialog.open(SigninComponent,{
            disableClose: false,
            maxWidth: '80vw',
            maxHeight: '90vh',
            width: '600px',
            panelClass: 'sigin-in-popup'
          });
          dialog.afterClosed().subscribe(res =>{
            if(localStorage.getItem('email') !=null && localStorage.getItem('customerId')!=null){
              this.setJourneyForLater();
              this.sharedService.saveForLaterJourneyRequest = this.saveForLaterJourneyRequest;
              this.addJourneyForLater();
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
          });
        }
      });
    }
    else{
      this.setJourneyForLater();
      this.sharedService.saveForLaterJourneyRequest = this.saveForLaterJourneyRequest;
      this.addJourneyForLater();
      let dialogRef=this.dialog.open(ConfirmationMessageComponent, {
        maxWidth: '90%',
        maxHeight: '90vh',
        width: '400px',
        panelClass: 'delete-popup',
        data:{
          message: 'Your journey is successfully saved',
          isLoggedIn: true
        }
      });
      dialogRef.afterClosed().subscribe(res=>{
        this.openmyDialog();
      })
    }
  }

  setJourneyForLater(){
    this.saveForLaterJourneyRequest = new SaveForLaterJourneyRequest();
    if(this.searchRequest.IsReturnRequest){
      if(this.searchResultReturnList.outwardServiceId!=undefined){
        this.saveForLaterJourneyRequest.outwardfaregroupid = Number(this.searchResultReturnList.outwardFareGroup);
        this.saveForLaterJourneyRequest.outwardserviceid = Number(this.searchResultReturnList.outwardServiceId);
        this.saveForLaterJourneyRequest.returnfaregroupid = Number(this.searchResultReturnList.returnFareGroup);
        this.saveForLaterJourneyRequest.returnserviceid = Number(this.searchResultReturnList.returnServiceId);
        this.saveForLaterJourneyRequest.sessionid = localStorage.getItem("sessioncode");
      }
      else{
        this.saveForLaterJourneyRequest.outwardfaregroupid = this.searchResultList.selectedFare.fareGroupId;
        this.saveForLaterJourneyRequest.outwardserviceid = this.searchResultList.selectedJourneyResponse.serviceId;
        this.saveForLaterJourneyRequest.returnserviceid = Number(this.searchResultReturnList.returnServiceId);
        this.saveForLaterJourneyRequest.sessionid = localStorage.getItem("sessioncode");
      } 
    }
    else{
      this.saveForLaterJourneyRequest.outwardfaregroupid = this.searchResultList.selectedFare.fareGroupId;
      this.saveForLaterJourneyRequest.outwardserviceid = this.searchResultList.selectedJourneyResponse.serviceId;
      this.saveForLaterJourneyRequest.sessionid = localStorage.getItem("sessioncode");
    }
  }
  addJourneyForLater(){
    this.journeyExtraService.saveJourneyForLater(this.saveForLaterJourneyRequest).subscribe(
      res=>{
        if(res!=null){
          this.responseData = res as ResponseData;
          if(this.responseData.responseCode=='200'){
            this.storageDataService.setStorageData("SaveLaterData", this.responseData, true);
          }
        }
      }
    )
  }
}
