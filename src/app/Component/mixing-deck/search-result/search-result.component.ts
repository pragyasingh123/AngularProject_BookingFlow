import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { RailCardModel } from 'src/app/models/journey/railcard.model';
import { ActivatedRoute } from '@angular/router';
import { SearchSolutionService } from 'src/app/Services/search-solution.service';
import { ResponseData } from 'src/app/models/common/response';
import { JourneyResponse, JourneyFareDetails,JourneySearchResponse, JourneyReturnTimeDetails, JourneyFareBreakups } from 'src/app/models/journey/search-services-response';
import { JourneyDetailComponent } from '../journey-detail/journey-detail.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ShowEarlierShowLaterRequest } from 'src/app/models/journey/show-earlier-later-request';
import { ModifyQttSearchExpendedComponent } from 'src/app/Component/mixing-deck/modify-qtt-search-expended/modify-qtt-search-expended.component';
import * as moment from 'moment';
import { SharedService } from 'src/app/Services/shared.service';
import { FareBreakupModel, FareModel } from 'src/app/models/journey/fare-model';
import { ApplicationConstants } from 'src/app/models/Constants/constants.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionExpiredComponent } from 'src/app/Component/session-expired/session-expired.component';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SortByPopupComponent } from './sort-by-popup/sort-by-popup.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class SearchResultComponent implements OnInit {
  
  public show1:boolean = false;
  displayedColumns = ['sortby', 'departureTime', 'arrivalTime', 'totalChanges','duration','minimumFare','journeytype','infobutton'];
  DepartureStation: any;
  ArrivalStation: any;
  responseData: ResponseData;
  JourneySearchResponseData : JourneySearchResponse;
  OutwardOpenPureReturnFaredataSource : any;
  SingleOutwarddataSource : any;
  SingleReturndataSource  : any;
  JourneyReturnTimeDetailsdataSource  : any;
  JourneyFareBreakupsdataSource : any;
  IsWait = false;
  IsDataComingFromUrl=true;
  IsShowEarlierbuttonDisabled = false;
  IsShowLaterbuttonDisabled = false;
  ShowEarlierShowLater : ShowEarlierShowLaterRequest;
  JourneyExtenedAPIHeader : string;
  isHide : boolean =true;
  listCounter: number = 0;
  currentDateString: string;
  ongoingDateString: string;
  minDate: Date = new Date();
  maxDate: string = moment(this.minDate).add(7,'days').format('YYYY-MM-DD');
  newmaxDate: string ;
  journeytypedisplay:string;
   Farestart : Number;
   FareLimit :Number;
  LastServiceIdCurrentDataSource :  number;
  FirstserviceIdCurrentDataSource : number;
  LastIndexCurrentDataSource : number;
  FirstIndexCurrentDataSource : number;
  TempDataSource : any;
  ongoingDateReturnString:string;
  showToolTip:boolean;
  NewServicesRequired : number;
  index : number ;
  selectedFare: any;
  
  selectedJourneyResponse: any;
  JourneyFareSelectedRow : number = -1;
  
  @Input() searchRequest: SearchRequestModel;
  @Output() shareData: EventEmitter<any> = new EventEmitter();
  @Output() ReturnTimeDetailsdataSource: EventEmitter<Array<JourneyReturnTimeDetails>> = new EventEmitter<Array<JourneyReturnTimeDetails>>();
  @Output() isReturnBoxExpended: EventEmitter<boolean> = new EventEmitter();
  @Output("openmyDialog") openmyDialog: EventEmitter<any> = new EventEmitter();

  singleFare: number = 0;
  @Output()  SearchResultComponent =  new EventEmitter(); 
  @Input() tooltip:boolean;
  isBuyNowDisable:boolean=true;
  dataSource: MatTableDataSource<any[]>;
  dataSourceOutward: MatTableDataSource<any[]>;
  dataSourceReturn: MatTableDataSource<any[]>;
  @ViewChild(MatSort,{static:true}) sort:MatSort;
  @ViewChild('table1', { read: MatSort, static: true }) sort1: MatSort;
  @ViewChild('table2', { read: MatSort, static: true }) sort2: MatSort;
  sharedStorage: any;
    constructor( private storageDataService:StorageDataService,public spinnerService: NgxSpinnerService,public dialog: MatDialog,private route:ActivatedRoute,private searchSolutionService:SearchSolutionService, public sharedService:SharedService) 
  {
    this.currentDateString = moment(new Date()).format('YYYY-MM-DD');
    this.ShowEarlierShowLater = new ShowEarlierShowLaterRequest();
    this.JourneySearchResponseData = new JourneySearchResponse();
    this.OutwardOpenPureReturnFaredataSource = this.JourneySearchResponseData.OutwardOpenPureReturnFare as JourneyResponse[];
    this.SingleOutwarddataSource = this.JourneySearchResponseData.SingleOutward as JourneyResponse[];
    this.SingleReturndataSource = this.JourneySearchResponseData.SingleReturn as JourneyResponse[];
    this.JourneyReturnTimeDetailsdataSource = this.JourneySearchResponseData.JourneyReturnTimeDetails as JourneyReturnTimeDetails[];
    this.JourneyFareBreakupsdataSource = this.JourneySearchResponseData.JourneyFareBreakups as JourneyFareBreakups[];
    this.sharedService.fareBreakupModelData = new Array<FareBreakupModel>();
    this.sharedService.fareBreakupModelData[0] = new FareBreakupModel();
    this.Farestart = 0;
    this.FareLimit = 1;
    this.TempDataSource = this.JourneySearchResponseData.OutwardOpenPureReturnFare as JourneyResponse[];
    this.dataSource = new MatTableDataSource(this.OutwardOpenPureReturnFaredataSource);
    this.dataSourceOutward = new MatTableDataSource(this.SingleOutwarddataSource);
    this.dataSourceReturn = new MatTableDataSource(this.SingleReturndataSource);
  }
  
  ngOnInit() {
    if(this.IsDataComingFromUrl==true){
      this.IsWait=false;
      this.journeytypeshow();
      this.ngOnInitFunction(); 
    }
  }

  openSortingPopup()
  {
    this.dialog.open(SortByPopupComponent, {
        maxWidth: '95vw',
        maxHeight: '100vh',
        width: '100%',
        panelClass: 'sortBy-Popup'
      });
  }
  ViewMoreDetails()
  {
    
    //  this.FareLimit = Number(this.FareLimit) + 10;   
     this.FareLimit =Number(this.FareLimit) + 9999;

  }
  ViewLessDetails()
  {
    // this.FareLimit = Number(this.FareLimit) - 10;
    this.FareLimit = Number(this.FareLimit) - 9999;
  }


journeytypeshow()
{
   if ( this.searchRequest.oneway =="1" && this.searchRequest.openreturn =="0")
 {
  this.journeytypedisplay='Outward';
} else if
(this.searchRequest.openreturn=="1" && this.searchRequest.oneway=="0")
{
this.journeytypedisplay='Open Return';
}
else if
(this.searchRequest.oneway=="0" && this.searchRequest.openreturn=="0")
{
this.journeytypedisplay='Return Fares';
}
}
  ngOnInitFunction(){ 
  

    if (!this.sharedService.isAmendSearchOpen || localStorage.getItem("isRequestFromAnotherUrl")) {
    this.singleFare=0;
    this.shareData.emit(this.singleFare/100);
    this.ongoingDateString = moment(new Date(this.searchRequest.datetimedepart)).format('YYYY-MM-DD');
    
    if (this.searchRequest.TravelSolutionDirection == "ONE_WAY" || this.searchRequest.TravelSolutionDirection == "OPEN_RETURN") {
      this.searchRequest.datetimereturn = null;
      //this.getTravelSolutions();
    }
    else if (this.searchRequest.TravelSolutionDirection == "RETURN") {
      this.searchRequest.IsReturnRequest = true;
      this.ongoingDateReturnString = moment(new Date(this.searchRequest.datetimereturn)).format('YYYY-MM-DD');
    }
    this.getTravelSolutions();
    this.DepartureStation = this.searchRequest.DepartureLocationName.split('(')[0];
    this.ArrivalStation = this.searchRequest.ArrivalLocationName.split('(')[0];
  }
    localStorage.removeItem("isRequestFromAnotherUrl");
    this.sharedService.isRequestFromAnotherUrl=false;
    this.sharedService.isAmendSearchOpen=false;
    this.storageDataService.clearStorageData("storedAllServices");
    this.storageDataService.setStorageData("storedAllServices",this.sharedService,true);
  
}

  ngOnChanges(changes:SimpleChanges){
    if(changes.tooltip!=undefined){
      this.tooltip=changes.tooltip.currentValue;
      
    }
    else{
      if(changes.searchRequest!=undefined && changes.searchRequest.currentValue!=""){
        this.searchRequest=changes.searchRequest.currentValue;
        this.ngOnInitFunction();  
      }
     
    }
  }

  
  addReturnDialog(){
    // const dialogRef=this.dialog.open(ModifyQttSearchExpendedComponent, {
    //   maxWidth: '100vw',
    //   maxHeight: '100vh',
    //   width: '100%',
    //   panelClass: 'journeyDialog'
    // });
    // dialogRef.componentInstance.expendedSearchRequest = this.searchRequest;
    this.sharedService.addReturnTabIndex = 1;
    this.openmyDialog.emit();
  }

  getTravelSolutions() {
    if(this.searchRequest.passengergroup.length==0){
      let railcard = new RailCardModel;
      railcard.adults=1;
      railcard.Children=0;
      railcard.numberofrailcards=0;
      railcard.RailCardCode="";
      this.searchRequest.passengergroup.push(railcard);
    }

    if(this.searchRequest.sessionid==null){
      this.searchRequest.sessionid=localStorage.getItem("sessioncode");
    }
    if(this.storageDataService.getStorageData('storedAllServices', true) != null)
    {
      this.sharedService = this.storageDataService.getStorageData('storedAllServices', true)
      if(this.sharedService.IsSessionExpired == true)
      {
        this.searchRequest.sessionid = null;
      }
    }
    this.OutwardOpenPureReturnFaredataSource = null;
    this.spinnerService.show();
    this.searchSolutionService.getSolutions(this.searchRequest).subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200') {
            localStorage.setItem('sessioncode', this.responseData.sessionCode);
            var data = this.responseData.data;
            this.OutwardOpenPureReturnFaredataSource= data.outwardOpenPureReturnFare;
            this.JourneyFareBreakupsdataSource = data.journeyFareBreakups;
            if (this.searchRequest.oneway =="0" && this.searchRequest.openreturn =="0"){
              this.SingleOutwarddataSource = data.singleOutward;
              this.SingleReturndataSource = data.singleReturn;
              this.JourneyReturnTimeDetailsdataSource = data.journeyReturnTimeDetails;
              this.JourneyFareBreakupsdataSource = data.journeyFareBreakups;
            }
              this.OutwardOpenPureReturnFaredataSource.sort((data1, data2) => {
                return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
              });
            this.dataSource=new MatTableDataSource(this.OutwardOpenPureReturnFaredataSource);
            this.dataSource.sort=this.sort;
            if(this.OutwardOpenPureReturnFaredataSource[0].firstInDay == true)
            {
              this.IsShowEarlierbuttonDisabled = true;
            }
            else
                  this.IsShowEarlierbuttonDisabled = false;
            if(this.OutwardOpenPureReturnFaredataSource[this.OutwardOpenPureReturnFaredataSource.length - 1].lastInDay == true)
            {
              this.IsShowLaterbuttonDisabled = true;  
            }
            else
            this.IsShowLaterbuttonDisabled = false;


            if(this.SingleOutwarddataSource!=null && this.SingleOutwarddataSource.length>0)
            {
              
                this.SingleOutwarddataSource.sort((data1, data2) => {
                  return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
                });
                this.dataSourceOutward=new MatTableDataSource(this.SingleOutwarddataSource);
                this.dataSourceOutward.sort=this.sort1;
            if(this.SingleOutwarddataSource[0].firstInDay == true)
            this.sharedService.IsShowEarlierbuttonDisabledSingleOutward = true;
            else
            this.sharedService.IsShowEarlierbuttonDisabledSingleOutward = false;
            if(this.SingleOutwarddataSource[this.SingleOutwarddataSource.length - 1].lastInDay == true)
            this.sharedService.IsShowLaterbuttonDisabledSingleOutward = true;   
            else
            this.sharedService.IsShowLaterbuttonDisabledSingleOutward = false; 
          }

          if(this.SingleReturndataSource!=null && this.SingleReturndataSource.length>0)
          {
            
              this.SingleReturndataSource.sort((data1, data2) => {
                return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
              });
              this.dataSourceReturn=new MatTableDataSource(this.SingleReturndataSource);
              this.dataSourceReturn.sort=this.sort2;
            if(this.SingleReturndataSource[0].firstInDay == true)
            {
              this.sharedService.IsShowEarlierbuttonDisabledSingleReturn = true;
            }
            else
                  this.sharedService.IsShowEarlierbuttonDisabledSingleReturn = false;
            if(this.SingleReturndataSource[this.SingleReturndataSource.length - 1].lastInDay == true)
            {
              this.sharedService.IsShowLaterbuttonDisabledSingleReturn = true;  
            }
            else
                  this.sharedService.IsShowLaterbuttonDisabledSingleReturn = false;   
            }
          }
        }
        this.spinnerService.hide();
      });
      
  }
 

  onClickGetNextDaySearch(_date: any,_datetimereturn:Date) {
    
    if (this.listCounter < 7) {
      var date = new Date(this.searchRequest.datetimedepart);
     
      this.newmaxDate = moment(this.searchRequest.datetimedepart).add(7,'days').format('YYYY-MM-DDTHH:mm:ss');
      var nextDate = date.setDate(date.getDate() + 1);
      // dd=_datetimereturn;
      this.searchRequest.datetimedepart = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
      // if(this.searchRequest.datetimereturn<= this.searchRequest.datetimedepart)
      if (_datetimereturn!=null ||this.searchRequest.datetimereturn<= this.searchRequest.datetimedepart){
        var dd= new Date(_datetimereturn);
        dd=new Date(this.searchRequest.datetimedepart);
       // var newnextDate = dd.setDate(dd.getDate() + 1);
       this.searchRequest.datetimereturn = moment(dd).format('YYYY-MM-DDTHH:mm:ss');
       }
      this.ongoingDateString = moment(nextDate).format('YYYY-MM-DD');
      this.getTravelSolutions();
      this.listCounter++;
       }
   }

  onClickGetPreviousDaySearch(_datePrevious: any) {
    
  if (this.listCounter > -7) {
    var date = new Date(this.searchRequest.datetimedepart);
    var nextDate = date.setDate(date.getDate() - 1);
    this.searchRequest.datetimedepart = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
    this.ongoingDateString = moment(nextDate).format('YYYY-MM-DD');
    this.getTravelSolutions();
    this.listCounter--;
  }
}
//This method is used to manage the Show later and Show Earlier functionality
showEarlierOrLater(direction)
{
  this.spinnerService.show();
  this.ShowEarlierShowLater.direction = direction;
  this.ShowEarlierShowLater.journeydirection = (this.journeytypedisplay=='Outward')?"Outward":"Return";
  this.ShowEarlierShowLater.extendtimetable = 0; 
  this.ShowEarlierShowLater.sessionid = localStorage.getItem('sessioncode');
  this.JourneyExtenedAPIHeader = "?direction=" + this.ShowEarlierShowLater.direction + "&journeydirection=" + this.ShowEarlierShowLater.journeydirection + "&extendtimetable=" + this.ShowEarlierShowLater.extendtimetable + "&sessionid=" + this.ShowEarlierShowLater.sessionid;
  var totalRunningServices = this.OutwardOpenPureReturnFaredataSource.length;
  if(totalRunningServices>0){
    this.sharedService.managePageIndex.startServiceTimeOutwardReturnOpenReturn = this.OutwardOpenPureReturnFaredataSource[0].departureTime;
    this.sharedService.managePageIndex.endServiceTimeOutwardReturnOpenReturn = this.OutwardOpenPureReturnFaredataSource[totalRunningServices-1].departureTime;
  }
  this.searchSolutionService.GetJourneyExtendedSolution(this.JourneyExtenedAPIHeader).subscribe(
  res => {
    if (res != null) {
      this.responseData = res as ResponseData;
      if (this.responseData.responseCode == '200') {
        var data = this.responseData.data;
        localStorage.setItem('sessioncode', this.responseData.sessionCode);
        this.OutwardOpenPureReturnFaredataSource= data.outwardOpenPureReturnFare;
          
      this.OutwardOpenPureReturnFaredataSource.sort((data1, data2) => {
        return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
      });
      if(this.OutwardOpenPureReturnFaredataSource.length>0)
      {
        if(direction=="Earlier")
        {
          if(this.OutwardOpenPureReturnFaredataSource.filter(x=>
            x.departureTime<this.sharedService.managePageIndex.startServiceTimeOutwardReturnOpenReturn).length<=7)
            {
              totalRunningServices = this.OutwardOpenPureReturnFaredataSource.length;
              this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.slice(0,totalRunningServices<7?totalRunningServices:7);
            }
            else
            {
              this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.filter(x=>
                x.departureTime<this.sharedService.managePageIndex.startServiceTimeOutwardReturnOpenReturn)
              totalRunningServices = this.OutwardOpenPureReturnFaredataSource.length;
              this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.slice(totalRunningServices-7,totalRunningServices);     
            }
        }
        else
        {
          if(this.OutwardOpenPureReturnFaredataSource.filter(x=>
            x.departureTime>this.sharedService.managePageIndex.endServiceTimeOutwardReturnOpenReturn).length<=7){
              totalRunningServices = this.OutwardOpenPureReturnFaredataSource.length;
              this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.slice(totalRunningServices<7?0:totalRunningServices-7,totalRunningServices);
            }
            else
            {
              this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.filter(x=>
                x.departureTime>this.sharedService.managePageIndex.endServiceTimeOutwardReturnOpenReturn)
                totalRunningServices = this.OutwardOpenPureReturnFaredataSource.length;
                this.OutwardOpenPureReturnFaredataSource = this.OutwardOpenPureReturnFaredataSource.slice(0,7);
            }
        }
        this.IsShowLaterbuttonDisabled = this.OutwardOpenPureReturnFaredataSource[this.OutwardOpenPureReturnFaredataSource.length-1].lastInDay;
        this.IsShowEarlierbuttonDisabled = this.OutwardOpenPureReturnFaredataSource[0].firstInDay;
      }
      this.dataSource=new MatTableDataSource(this.OutwardOpenPureReturnFaredataSource);
    }
    else
      {
       if(this.responseData.data == null)
         {
           this.spinnerService.hide();
           this.dialog.open(SessionExpiredComponent, {
             maxWidth: '95vw',
             maxHeight: '95vh',
             width: '600px',
             panelClass: 'session-expired'
           });
          return;
         }
      }
  }
  this.spinnerService.hide();
  });
 }
 
//  sortDatasource(selectedColumn){
//   if(selectedColumn=='price'){
//     this.OutwardOpenPureReturnFaredataSource=this.sharedService.OutwardOpenPureReturnFaredataSource;
//     this.OutwardOpenPureReturnFaredataSource.sort((data1,data2)=>{
//       return data1.minimumFare - data2.minimumFare;
//     })
//   }
//  }

showRouteDetails(row, $event)
 {
  $event.stopPropagation();
  let dialogRef = this.dialog.open(JourneyDetailComponent, { 
      disableClose: false,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '75%',
      panelClass: 'trainschedule',
      data: {
        TravelSolutionCode: localStorage.getItem('sessioncode'),
        TravelSolutionId: row.enquiryId,
        TravelSolutionServiceId: row.serviceId,
        Changes: row.totalChanges,
        Duration: row.duration
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    });
  }

  onSelectFareTravelSolution(journeyFare,journeyResponse,RowIndex : number){
    this.isBuyNowDisable=false;
    this.JourneyFareSelectedRow = RowIndex;
    this.GetJourneyFare(journeyResponse,journeyFare);    
   }

   GetReturnJourneyTimeDetails(_element:any,expendedState:boolean)
  {    
    
    this.JourneyFareSelectedRow=-1;
    if(expendedState == true)
    {
      this.GetJourneyFare(_element,null);
    }
    else if(expendedState == false)
    {




      this.singleFare = 0;
      //this.sharedService.fareBreakupModelData[0].OutWardJourney = this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => (h.JourneyFareTypeDup1  !== "Outward and Return" || h.JourneyFareTypeDup1  !== "Outward and Return") && (h.JourneyFareTypeDup1  !== "Outward" || h.JourneyFareTypeDup1  !== "Outward"));
      this.sharedService.fareBreakupModelData[0].OutWardJourney = this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => ((!h.JourneyFareType.includes("Outward")) && (!h.JourneyFareTypeDup1.includes("Outward"))  && (!h.JourneyFareTypeDup2.includes("Outward")))
      && ((!h.JourneyFareType.includes("Outward and Return")) && (!h.JourneyFareTypeDup1.includes("Outward and Return"))  && (!h.JourneyFareTypeDup2.includes("Outward and Return"))));
      
      this.sharedService.fareBreakupModelData.forEach(obj=>{
        obj.OutWardJourney.forEach(objout=>{
          this.singleFare += objout.FareBreakup.totalFare;
        });
        this.shareData.emit(this.singleFare/100);
      });
    }
    if(this.JourneyReturnTimeDetailsdataSource!=undefined){
      this.isReturnBoxExpended.emit(expendedState);
      const fareGroup = _element.journeyFareDetails.filter(x=>x.fare == _element.minimumFare);
      if(fareGroup!=undefined && fareGroup.length>0){
        let element : HTMLElement =document.getElementById("tblSingleReturnJourney") as HTMLElement;
        if(element != null && element.children[1] != null){
            element.children[1].childNodes.forEach(item => {
            if(item.childNodes.length != 0 && (item as HTMLElement).className.includes("expanded-row")){
                    (item as HTMLElement).click();
            }
      });
     }
        this.ReturnTimeDetailsdataSource.emit(this.JourneyReturnTimeDetailsdataSource.filter(x=>x.fareGroupId==fareGroup[0].fareGroupId))
      }
      else{
      
        this.ReturnTimeDetailsdataSource.emit(null);
      }
    }
  }
  GetJourneyFare(journeyResponse:any,journeyFare){
   
   var minimumfareGroup = journeyResponse.journeyFareDetails.filter(x=>x.fare == journeyResponse.minimumFare);
  if(journeyFare == null)
  {
    journeyFare = minimumfareGroup[0];
    
  }
    this.sharedService.fareBreakupModelData[0].OutWardJourney = new Array<FareModel>();
    this.singleFare = journeyFare.fare;
    this.sharedService.fareBreakupModes=new Array<string>(); //reseting the fare breakup Modes , used in Return Journey
    this.sharedService.sendFareData(journeyFare);
    this.selectedFare = journeyFare;
    this.selectedJourneyResponse = journeyResponse;
    var index = 0 ;
    this.sharedService.resetFareBreakDownData();
    journeyFare.fareBreakupId.forEach(element => {
      let fareBreakup = this.JourneyFareBreakupsdataSource.filter(m=>m.fareBreakupId==element);
      fareBreakup.forEach(objfb => {
        var outJourney = new FareModel();
        outJourney.FareBreakup= objfb;
        outJourney.JourneyFareType="";
        if(index==0){
          outJourney.JourneyFareType = (journeyResponse.journeyType==ApplicationConstants.RETURN)?ApplicationConstants.OUTWARD_AND_RETURN:ApplicationConstants.OUTWARD;
        }
        outJourney.JourneyFareTypeDup1 = (journeyResponse.journeyType==ApplicationConstants.RETURN)?ApplicationConstants.OUTWARD_AND_RETURN:ApplicationConstants.OUTWARD;
        index++;
        this.sharedService.fareBreakupModelData[0].OutWardJourney.push(outJourney);
      });
    
    });
    
    this.shareData.emit(this.singleFare/100);
    if(this.JourneyReturnTimeDetailsdataSource!=undefined && journeyResponse.JourneyReturnTimeDetails!=null && journeyResponse.JourneyReturnTimeDetails.length>0){
      this.ReturnTimeDetailsdataSource.emit(this.JourneyReturnTimeDetailsdataSource.filter(x=>x.fareGroupId==journeyFare.fareGroupId));
      }
      this.sharedService.selectedJourneyResponse.push(journeyResponse);
      this.storageDataService.setStorageData("storedAllServices", this.sharedService, true);
  }
}
