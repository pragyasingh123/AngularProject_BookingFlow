import { Component, OnInit,Input,Output,EventEmitter,SimpleChange, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JourneyResponse,JourneySearchResponse } from 'src/app/models/journey/search-services-response';
import * as moment from 'moment';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { SearchResultComponent } from 'src/app/Component/mixing-deck/search-result/search-result.component';
import { ResponseData } from 'src/app/models/common/response';
import { SearchSolutionService } from 'src/app/Services/search-solution.service';
import { IfStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ShowEarlierShowLaterRequest } from 'src/app/models/journey/show-earlier-later-request';
import { SharedService } from 'src/app/Services/shared.service';
import { JourneyDetailComponent } from '../journey-detail/journey-detail.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { element } from 'protractor';
import { NgxSpinnerService } from 'ngx-spinner';

import { analyzeAndValidateNgModules } from '@angular/compiler';
import { FareModel } from 'src/app/models/journey/fare-model';
import { ApplicationConstants } from 'src/app/models/Constants/constants.model';
import { SessionExpiredComponent } from 'src/app/Component/session-expired/session-expired.component';
import { AlertMessage } from 'src/app/models/common/alert-message';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
@Component({
  selector: 'app-return-search-result',
  templateUrl: './return-search-result.component.html',
  styleUrls: ['./return-search-result.component.css'],
  animations: [
    trigger('detailExpand1', [
      state('collapsed1', style({height: '0px', minHeight: '0'})),
      state('expanded1', style({height: '*'})),
      transition('expanded1 <=> collapsed1', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ],
    ),
    trigger('detailExpand2', [
      state('collapsed2', style({height: '0px', minHeight: '0'})),
      state('expanded2', style({height: '*'})),
      transition('expanded2 <=> collapsed2', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class ReturnSearchResultComponent implements OnInit {
  @ViewChild("SearchResultCom", { static: false }) SearchResultCom: SearchResultComponent;
  @Input() SingleOutwarddataSource : any;
  @Input() SingleReturndataSource  : any;
  @Input() JourneyReturnTimeDetailsdataSource  : any;
  @Input() JourneyFareBreakupsdataSource : any;
  @Input() searchRequest: SearchRequestModel;
  @Output() GetPreNextResults = new EventEmitter();
  @Output()  GetPrePreviousResults= new EventEmitter();
  @Input() SearchResultList : any;
  @Input() ReturnTimeDetailsdataSource  : any;
  @Input() isReturnBoxExpended:boolean;
  @Input() IsDisabledNextPre : boolean;

  firstlistCounter:number = 0;
  secondlistCounter:number = 0;
  singleReturnongoingDateString:string;
  newdatetimereturn:string;
  newdatetimepart:string
  ReturnongoingDateString:string;
  currentDateString:string;
  OutwardOpenPureReturnFaredataSource : any;
  JourneySearchResponseData : JourneySearchResponse;
  responseData: ResponseData;
  IsShowEarlierbuttonDisabled = false;
  IsShowLaterbuttonDisabled = false;
  maxnextsingleDateString: string;
  minPrevioussingletDateString:string;
  maxnextoutDateString:string;
  DepartureStation: any;
  ArrivalStation: any;
  displayedColumns = ['departureTime', 'arrivalTime', 'totalChanges', 'duration', 'minimumFare', 'journeytype', 'infobutton'];
  displayedColumns2 = ['departureTime', 'arrivalTime', 'totalChanges', 'duration', 'minimumFare', 'journeytype', 'infobutton'];
  displayedColumns1 = ['departureTime', 'arrivalTime', 'totalChanges', 'duration', 'selectReturnTime', 'infobutton'];
  ShowEarlierShowLater : ShowEarlierShowLaterRequest;
  JourneyExtenedAPIHeader : string;
  IsWait: boolean;
  LastServiceIdCurrentDataSource :  number;
  FirstserviceIdCurrentDataSource : number;
  LastIndexCurrentDataSource : number;
  FirstIndexCurrentDataSource : number;
  TempDataSourceSingleOutward : any;
  TempDataSourceSingleReturn : any;
  NewServicesRequired : number;
  ongoingDateString: string;
  ongoingDateReturnString: string;
  index : number ;
  JourneyFareSelectedRow : number = -1;
  ReturnJourneyFareSelectedRow : number = -1;
  selectedFare : any;
  selectedJourney : any;
  isBuyNowDisable:boolean=true;
  isBuyNowDisableReturn:boolean=true;
  @ViewChild('table1', { read: MatSort, static: true }) sort1: MatSort;
  @ViewChild('table2', { read: MatSort, static: false }) sort2: MatSort;
    constructor(public spinnerService: NgxSpinnerService,  public dialog: MatDialog,
      public searchSolutionService: SearchSolutionService, private sharedService : SharedService ,
      public ss:SearchResultComponent, private SharedStorageData : StorageDataService) {
      this.ShowEarlierShowLater = new ShowEarlierShowLaterRequest();
      this.JourneySearchResponseData = new JourneySearchResponse();
      this.TempDataSourceSingleOutward = this.JourneySearchResponseData.SingleOutward as JourneyResponse[];
      this.TempDataSourceSingleReturn = this.JourneySearchResponseData.SingleReturn as JourneyResponse[];
      this.SingleOutwarddataSource = new Array<JourneyResponse>();
      this.SingleReturndataSource = new Array<JourneyResponse>();
      this.currentDateString = moment(new Date()).format('YYYY-MM-DD');
     }
     ngOnInit()
     { 
       this.DepartureStation = this.searchRequest.DepartureLocationName.split('(')[0];
       this.ArrivalStation = this.searchRequest.ArrivalLocationName.split('(')[0];
      //  this.ss.getTravelSolutions();
    //  localStorage.clear();
     }
     onMatSortChangeOutward(){
      this.SearchResultList.dataSourceOutward.sort=this.sort1;
     }
     onMatSortChangeReturn(){
      this.SearchResultList.dataSourceReturn.sort=this.sort2;
     }
    onClicksingleReturnGetNextDaySearch() {
      
    if (this.secondlistCounter < 7) {
      var date = new Date(this.searchRequest.datetimereturn);
      var nextDate = date.setDate(date.getDate() + 1);
      this.searchRequest.datetimereturn = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
      this.singleReturnongoingDateString = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
      if(this.secondlistCounter==6)
      {
         this.maxnextsingleDateString = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
      }
      this.getTravelSolutions();
      this.secondlistCounter++;
    }
   }
   
   onClickoutReturnGetNextDaySearch(datetimereturn:any) {
    
    if (this.firstlistCounter < 7) {
     
     var datereturn =new Date(this.searchRequest.datetimereturn);
     this.newdatetimereturn=moment(datereturn).format('YYYY-MM-DDTHH:mm:ss');
     var date = new Date(this.searchRequest.datetimedepart);
     var nextDate = new Date(date.setDate(date.getDate() + 1));
     this.newdatetimepart=moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
     this.ReturnongoingDateString= moment(nextDate).format('YYYY-MM-DD');
     if(new Date(datereturn)<=new Date(this.newdatetimepart))
    {
    
      localStorage.setItem('newReturndate',this.newdatetimereturn);
      // this.RetunGetPreNextResult.emit(this.newdatetimereturn)
       this.GetPreNextResults.emit(this.newdatetimepart);
    }
    else
    {
       this.GetPreNextResults.emit(moment(nextDate).format('YYYY-MM-DDTHH:mm:ss'));
    }
    if(this.firstlistCounter==6)
    {
    this.maxnextoutDateString= moment(nextDate).format('YYYY-MM-DDs');
    }
  }
}
  
  onClickoutReturnGetPreviousDaySearch() {
   
    var date = new Date(this.searchRequest.datetimedepart);
    var nextDate = date.setDate(date.getDate() - 1);
    this.GetPrePreviousResults.emit(moment(nextDate).format('YYYY-MM-DDTHH:mm:ss'));
    this.ReturnongoingDateString= moment(nextDate).format('YYYY-MM-DD');
     this.ReturnongoingDateString= moment(nextDate).format('YYYY-MM-DD');
   }

onClicksingleReturnGetPreviousDaySearch() {
  
  var date = new Date(this.searchRequest.datetimereturn);
  var nextDate = date.setDate(date.getDate() - 1);
  this.searchRequest.datetimereturn = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
  this.singleReturnongoingDateString = moment(nextDate).format('YYYY-MM-DDTHH:mm:ss');
  this.searchRequest.datetimedepart;
  this.getTravelSolutions();
  this.secondlistCounter--;
}
getTravelSolutions() {
  this.IsWait= true;
  this.spinnerService.show();
  this.OutwardOpenPureReturnFaredataSource = null;
  if(this.SharedStorageData.getStorageData('storedAllServices', true) != null)
    {
      this.sharedService = this.SharedStorageData.getStorageData('storedAllServices', true)
      if(this.sharedService.IsSessionExpired == true)
      {
        this.searchRequest.sessionid = null;
      }
    }
  this.searchSolutionService.getSolutions(this.searchRequest).subscribe(
    res => {
      if (res != null) {
        this.responseData = res as ResponseData;
        if (this.responseData.responseCode == '200') {
        
          var data = this.responseData.data;
          this.OutwardOpenPureReturnFaredataSource= data.outwardOpenPureReturnFare;
          this.JourneyFareBreakupsdataSource = data.journeyFareBreakups;
          if (this.searchRequest.oneway =="0" && this.searchRequest.openreturn =="0"){
            this.SingleOutwarddataSource = data.singleOutward;
            this.SingleReturndataSource = data.singleReturn;
            this.SearchResultList.SingleReturndataSource=this.SingleReturndataSource;
            this.JourneyReturnTimeDetailsdataSource = data.journeyReturnTimeDetails;
            this.JourneyFareBreakupsdataSource = data.journeyFareBreakups;
          }
          this.IsWait= false;
          this.OutwardOpenPureReturnFaredataSource.sort((data1, data2) => {
            return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
          });
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

  // ngOnInitFunction(){ 
  //   debugger
  //   // this.singleFare=0;
  //   // this.shareData.emit(this.singleFare/100);
  //   // this.ongoingDateString = moment(new Date(this.searchRequest.datetimedepart)).format('YYYY-MM-DD');
  //   // //this.searchRequest.DepartureTimesStartShow = new Date(this.searchRequest.DepartureTimesStart);
  //   // this.searchResultCompo.getTravelSolutions();
  //   // this.DepartureStation = this.searchRequest.DepartureLocationName.split('(')[0];
  //   // this.ArrivalStation = this.searchRequest.ArrivalLocationName.split('(')[0];

  //   this.ongoingDateString = moment(new Date(this.searchRequest.datetimedepart)).format('YYYY-MM-DD');
  //     //this.searchRequest.DepartureTimesStartShow = new Date(this.searchRequest.DepartureTimesStart);
  //     this.ongoingDateReturnString = moment(new Date(this.searchRequest.datetimereturn)).format('YYYY-MM-DD');
  //     //this.searchRequest.ReturnTimesStartShow = new Date(this.searchRequest.ReturnTimesStart);
  //     this.searchResultCompo.getTravelSolutions();

  //   this.DepartureStation = this.searchRequest.DepartureLocationName.split('(')[0];
  //   this.ArrivalStation = this.searchRequest.ArrivalLocationName.split('(')[0];
  // }

          if(this.SingleOutwarddataSource!=null && this.SingleOutwarddataSource.length>0)
        {
          this.SingleOutwarddataSource.sort((data1, data2) => {
          return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
          });
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
      // this.SearchResultList.SingleReturndataSource=this.SingleOutwarddataSource;
    });
}

showEarlierSingleOutward()
{
  this.ShowEarlierShowLater.direction = "Earlier";
  this.ShowEarlierShowLater.journeydirection = "Outward";
  this.ShowEarlierShowLater.extendtimetable = 0;
  this.ShowEarlierShowLater.sessionid = localStorage.getItem('sessioncode'); 
  this.JourneyExtenedAPIHeader = "?direction=" + this.ShowEarlierShowLater.direction + "&journeydirection=" + this.ShowEarlierShowLater.journeydirection + "&extendtimetable=" + this.ShowEarlierShowLater.extendtimetable + "&sessionid=" + this.ShowEarlierShowLater.sessionid;
  this.GetEarlierLaterJourneySingleOutward();
 
}
showLaterSingleOutward()
{
  this.ShowEarlierShowLater.direction = "Later";
 this.ShowEarlierShowLater.journeydirection = "Outward";
 this.ShowEarlierShowLater.extendtimetable = 0; 
 this.ShowEarlierShowLater.sessionid = localStorage.getItem('sessioncode'); 
 this.JourneyExtenedAPIHeader = "?direction=" + this.ShowEarlierShowLater.direction + "&journeydirection=" + this.ShowEarlierShowLater.journeydirection + "&extendtimetable=" + this.ShowEarlierShowLater.extendtimetable + "&sessionid=" + this.ShowEarlierShowLater.sessionid;
 this.GetEarlierLaterJourneySingleOutward();
}

GetEarlierLaterJourneySingleOutward()
{

 this.spinnerService.show();
 this.TempDataSourceSingleOutward = this.SearchResultList.SingleOutwarddataSource;
 this.LastServiceIdCurrentDataSource = this.TempDataSourceSingleOutward[this.TempDataSourceSingleOutward.length-1].serviceId;
this.FirstserviceIdCurrentDataSource = this.TempDataSourceSingleOutward[0].serviceId;
 this.searchSolutionService.GetJourneyExtendedSolution(this.JourneyExtenedAPIHeader).subscribe(
   res => {
     if (res != null) {
      this.responseData = res as ResponseData;
       if (this.responseData.responseCode == '200') {
        localStorage.setItem('sessioncode', this.responseData.sessionCode); 
        var data = this.responseData.data;
           this.SingleOutwarddataSource= data.singleOutward;
          if(this.SingleOutwarddataSource!=undefined){
            this.SingleOutwarddataSource.sort((data1, data2) => {
              return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
            });
            if(this.ShowEarlierShowLater.direction =='Earlier')
              {
                this.sharedService.IsShowLaterbuttonDisabledSingleOutward = false; 
                
                if(this.SingleOutwarddataSource.length > 7 && this.SingleOutwarddataSource.length <= 14)
                 {
                  this.SingleOutwarddataSource =  this.SingleOutwarddataSource.slice(0,7);
                 }
     
                 else if(this.SingleOutwarddataSource.length > 14)
                 {
                   this.index = 0;
                  this.SingleOutwarddataSource.forEach(element=> {
                    if(element.serviceId == this.FirstserviceIdCurrentDataSource)
                       this.FirstIndexCurrentDataSource = this.index;
                     this.index= this.index + 1;
                  });
                  this.NewServicesRequired = this.FirstIndexCurrentDataSource; 
                  if(this.NewServicesRequired <= 7)
                  {
                   this.SingleOutwarddataSource = this.SingleOutwarddataSource.slice(0,7);
                 
                  }
                  if(this.NewServicesRequired > 7)
                  {
                 this.SingleOutwarddataSource = this.SingleOutwarddataSource.slice(this.NewServicesRequired - 7, this.NewServicesRequired);
                   }
                 }
              }
              
              else if(this.ShowEarlierShowLater.direction =='Later')
              {
               this.sharedService.IsShowEarlierbuttonDisabledSingleOutward = false;
              
               if(this.SingleOutwarddataSource.length > 7 && this.SingleOutwarddataSource.length <= 14)
                 {
                  this.SingleOutwarddataSource =  this.SingleOutwarddataSource.slice(this.SingleOutwarddataSource.length - 7, this.SingleOutwarddataSource.length);
                 }
                 else if(this.SingleOutwarddataSource.length > 14)
                 {
                   this.index = 0;
                  this.SingleOutwarddataSource.forEach(element=> {
                    if(element.serviceId == this.LastServiceIdCurrentDataSource)
                       this.LastIndexCurrentDataSource = this.index;
                     this.index= this.index + 1;
                  });
                  this.NewServicesRequired = this.SingleOutwarddataSource.length-1 - this.LastIndexCurrentDataSource; 
                  if(this.NewServicesRequired < 7)
                  {
                   this.TempDataSourceSingleOutward = this.TempDataSourceSingleOutward.slice(this.NewServicesRequired  , this.TempDataSourceSingleOutward.length);
                  this.SingleOutwarddataSource= this.SingleOutwarddataSource.slice(this.SingleOutwarddataSource.length - this.NewServicesRequired, this.SingleOutwarddataSource.length);
                   this.TempDataSourceSingleOutward = [...this.TempDataSourceSingleOutward, ...this.SingleOutwarddataSource];
                   this.SingleOutwarddataSource =  this.TempDataSourceSingleOutward;
                  }
                  if(this.NewServicesRequired >=7)
                  {
                   this.SingleOutwarddataSource = this.SingleOutwarddataSource.slice(this.LastIndexCurrentDataSource + 1, this.LastIndexCurrentDataSource + 8)
                  }
                 }
              }
              if(this.SingleOutwarddataSource[0].firstInDay == true)
              {
                this.sharedService.IsShowEarlierbuttonDisabledSingleOutward = true;
              }
              if(this.SingleOutwarddataSource[this.SingleOutwarddataSource.length - 1].lastInDay == true)
              {
                this.sharedService.IsShowLaterbuttonDisabledSingleOutward = true;  
              }
              this.SearchResultList.SingleOutwarddataSource = this.SingleOutwarddataSource;
               
          }
          this.SearchResultList.dataSourceOutward=new MatTableDataSource(this.SingleOutwarddataSource);          
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
showEarlierSingleReturn()
{
  this.ShowEarlierShowLater.direction = "Earlier";
  this.ShowEarlierShowLater.journeydirection = "Return";
  this.ShowEarlierShowLater.extendtimetable = 0;
  this.ShowEarlierShowLater.sessionid = localStorage.getItem('sessioncode'); 
  this.JourneyExtenedAPIHeader = "?direction=" + this.ShowEarlierShowLater.direction + "&journeydirection=" + this.ShowEarlierShowLater.journeydirection + "&extendtimetable=" + this.ShowEarlierShowLater.extendtimetable + "&sessionid=" + this.ShowEarlierShowLater.sessionid;
  this.GetEarlierLaterJourneySingleReturn();
}
showLaterSingleReturn()
{
 this.ShowEarlierShowLater.direction = "Later";
 this.ShowEarlierShowLater.journeydirection = "Return";
 this.ShowEarlierShowLater.extendtimetable = 0; 
 this.ShowEarlierShowLater.sessionid = localStorage.getItem('sessioncode'); 
 this.JourneyExtenedAPIHeader = "?direction=" + this.ShowEarlierShowLater.direction + "&journeydirection=" + this.ShowEarlierShowLater.journeydirection + "&extendtimetable=" + this.ShowEarlierShowLater.extendtimetable + "&sessionid=" + this.ShowEarlierShowLater.sessionid;
 this.GetEarlierLaterJourneySingleReturn();
}

GetEarlierLaterJourneySingleReturn()
{
 this.spinnerService.show();
 this.TempDataSourceSingleReturn =  this.SearchResultList.SingleReturndataSource;
 this.LastServiceIdCurrentDataSource = this.TempDataSourceSingleReturn[this.TempDataSourceSingleReturn.length -1].serviceId;
 this.FirstserviceIdCurrentDataSource = this.TempDataSourceSingleReturn[0].serviceId;
 this.searchSolutionService.GetJourneyExtendedSolution(this.JourneyExtenedAPIHeader).subscribe(
   res => {
     if (res != null) {
      this.responseData = res as ResponseData;
       if (this.responseData.responseCode == '200') {
         localStorage.setItem('sessioncode', this.responseData.sessionCode);
         
         var data = this.responseData.data;
         this.SingleReturndataSource= data.singleReturn;
         if(this.SingleReturndataSource!=undefined){
            this.SingleReturndataSource.sort((data1, data2) => {
            return <any>new Date(data1.departureTime) - <any>new Date(data2.departureTime);
            });
        if(this.ShowEarlierShowLater.direction =='Earlier')
          {
           this.sharedService.IsShowLaterbuttonDisabledSingleReturn = false;      
           if(this.SingleReturndataSource.length > 7 && this.SingleReturndataSource.length <= 14)
              this.SingleReturndataSource =  this.SingleReturndataSource.slice(0,7);
           else if(this.SingleReturndataSource.length > 14)
             {
              this.index = 0;
              this.SingleReturndataSource.forEach(element=> {
              if(element.serviceId == this.FirstserviceIdCurrentDataSource)
              this.FirstIndexCurrentDataSource = this.index;
              this.index= this.index + 1;
             });
       this.NewServicesRequired = this.FirstIndexCurrentDataSource; 
       if(this.NewServicesRequired <= 7)
       {
        this.SingleReturndataSource = this.SingleReturndataSource.slice(0,7);
      
       }
       if(this.NewServicesRequired > 7)
       {
      this.SingleReturndataSource = this.SingleReturndataSource.slice(this.NewServicesRequired - 7, this.NewServicesRequired);
        }
      }
    }
  else if(this.ShowEarlierShowLater.direction =='Later')
  {
    this.sharedService.IsShowEarlierbuttonDisabledSingleReturn = false;
    
   if(this.SingleReturndataSource.length > 7 && this.SingleReturndataSource.length <= 14)
     {
      this.SingleReturndataSource =  this.SingleReturndataSource.slice(this.SingleReturndataSource.length - 7, this.SingleReturndataSource.length);
     }
     else if(this.SingleReturndataSource.length > 14)
     {
       this.index = 0;
      this.SingleReturndataSource.forEach(element=> {
        if(element.serviceId == this.LastServiceIdCurrentDataSource)
           this.LastIndexCurrentDataSource = this.index;
         this.index= this.index + 1;
      });
      this.NewServicesRequired = this.SingleReturndataSource.length-1 - this.LastIndexCurrentDataSource; 
      if(this.NewServicesRequired < 7)
      {
       this.TempDataSourceSingleReturn = this.TempDataSourceSingleReturn.slice(this.NewServicesRequired  , this.TempDataSourceSingleReturn.length);
      this.SingleReturndataSource= this.SingleReturndataSource.slice(this.SingleReturndataSource.length - this.NewServicesRequired, this.SingleReturndataSource.length);
       this.TempDataSourceSingleReturn = [...this.TempDataSourceSingleReturn, ...this.SingleReturndataSource];
       this.SingleReturndataSource =  this.TempDataSourceSingleReturn;
      }
      if(this.NewServicesRequired >= 7)
      {
       this.SingleReturndataSource=  this.SingleReturndataSource.slice(this.LastIndexCurrentDataSource + 1, this.LastIndexCurrentDataSource + 8)
      }
     }
  }
  if(this.SingleReturndataSource[0].firstInDay == true)
  {
    this.sharedService.IsShowEarlierbuttonDisabledSingleReturn = true;
  }
  if(this.SingleReturndataSource[this.SingleReturndataSource.length - 1].lastInDay == true)
  {
    this.sharedService.IsShowLaterbuttonDisabledSingleReturn = true;  
  }
  this.SearchResultList.SingleReturndataSource = this.SingleReturndataSource;

}
  this.SearchResultList.dataSourceReturn=new MatTableDataSource(this.SingleReturndataSource);
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

showRouteDetails(row, $event) {
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
totalFare:number;
@Output() shareData: EventEmitter<any> = new EventEmitter();
outwardServiceId:string;
returnServiceId:string;
outwardFareGroup:string;
returnFareGroup:string;
onSelectFareTravelSolution(journeyFare,journeyResponse , mode,RowIndex:number){
  
  if(mode == "S"){
    this.isBuyNowDisable=false;
    this.SearchResultList.isBuyNowDisable=false;
    this.outwardServiceId=journeyResponse.serviceId;
    this.outwardFareGroup=journeyFare.fareGroupId;
    this.JourneyFareSelectedRow = RowIndex;
  }else if(mode == "R"){
    this.isBuyNowDisableReturn=false;
    this.SearchResultList.isBuyNowDisable=false;
    this.returnServiceId=journeyResponse.serviceId;
    this.returnFareGroup=journeyFare.fareGroupId;
    this.ReturnJourneyFareSelectedRow = RowIndex;
  }  
  this.GetJourneyFare(journeyResponse,journeyFare,mode);
 }

 onClickReturnTime(journeyResponse){
  this.returnServiceId=journeyResponse.serviceId;
  this.isBuyNowDisableReturn=false;
 }
 ngOnChanges(changes: SimpleChange){
  let element : HTMLElement =document.getElementById("tblSingleOutwardJourney") as HTMLElement;
  if(element != null && element.children[1] != null){
  element.children[1].childNodes.forEach(item => {
    if(item.childNodes.length != 0 && (item as HTMLElement).className.includes("expanded-row")){
    (item as HTMLElement).click();
    }
});
}
}

collapseReturnJourney(_element:any,expendedState:boolean)
{  
  this.JourneyFareSelectedRow=-1; 
   
  if(expendedState == true){     
     let element : HTMLElement =document.getElementById("tblOutwardOpenPureReturnFare") as HTMLElement;
     if(element != null && element.children[1] != null){
         element.children[1].childNodes.forEach(item => {
         if(item.childNodes.length != 0 && (item as HTMLElement).className.includes("expanded-row")){
                 (item as HTMLElement).click();
         }
   });
 }
 this.GetJourneyFare(_element,null,"S");
  }
  else if(expendedState == false){
    
    
    if(this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => (!h.JourneyFareType.includes("Outward and Return")) && (!h.JourneyFareTypeDup1.includes("Outward and Return"))  && (!h.JourneyFareTypeDup2.includes("Outward and Return"))).length != 0 )
    {
      this.totalFare = 0;
    this.sharedService.fareBreakupModelData[0].OutWardJourney = this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => (!h.JourneyFareType.includes("Outward")) && (!h.JourneyFareTypeDup1.includes("Outward"))  && (!h.JourneyFareTypeDup2.includes("Outward")));
    this.sharedService.fareBreakupModelData.forEach(obj=>{
      obj.OutWardJourney.forEach(objout=>{
        this.totalFare += objout.FareBreakup.totalFare;
      });
      this.shareData.emit(this.totalFare/100);
    }); 
  }
    

  }
}

GetJourneyFare(journeyResponse:any,journeyFare,mode){
  
  var minimumfareGroup = journeyResponse.journeyFareDetails.filter(x=>x.fare == journeyResponse.minimumFare);
  if(journeyFare == null)
  {
    journeyFare = minimumfareGroup[0];
  }
 if(this.sharedService.fareBreakupModes.length>0)
 {
   var oldFareModel = this.sharedService.fareBreakupModelData[0].OutWardJourney.filter(m=>m.JourneyFareTypeDup2 == (mode=="S"? ApplicationConstants.OUTWARD:ApplicationConstants.RETURN));
   oldFareModel.forEach(element=>{
     var index = this.sharedService.fareBreakupModelData[0].OutWardJourney.indexOf(element)
     this.sharedService.fareBreakupModelData[0].OutWardJourney.splice(index,1);
   });
 }
 else{
   this.sharedService.fareBreakupModelData[0].OutWardJourney = new Array<FareModel>();
 }

 this.sharedService.sendFareData(journeyFare);
 this.selectedFare = journeyFare;
 this.selectedJourney = journeyResponse;
 var index = 0 ;
 journeyFare.fareBreakupId.forEach(element => {
   let fareBreakup = this.SearchResultList.JourneyFareBreakupsdataSource.filter(m=>m.fareBreakupId==element);
   fareBreakup.forEach(objfb => {
     var outJourney = new FareModel();
     outJourney.FareBreakup= objfb;
     outJourney.JourneyFareType="";
     if(index==0){
       outJourney.JourneyFareType = (mode=="R")?ApplicationConstants.RETURN:ApplicationConstants.OUTWARD;
     }
     outJourney.JourneyFareTypeDup1 = (mode=="R")?ApplicationConstants.RETURN+index:ApplicationConstants.OUTWARD+index;
     outJourney.JourneyFareTypeDup2 = (mode=="R")?ApplicationConstants.RETURN:ApplicationConstants.OUTWARD;
     index++;
     this.sharedService.fareBreakupModelData[0].OutWardJourney.push(outJourney);
   });
 });
 if(this.sharedService.fareBreakupModes.filter(x=>x == mode).length==0){
   this.sharedService.fareBreakupModes.push(mode);
 }
   this.totalFare = 0;
   this.sharedService.fareBreakupModelData.forEach(obj=>{
     obj.OutWardJourney.forEach(objout=>{
       this.totalFare += objout.FareBreakup.totalFare;
     });
   });
   this.sharedService.fareBreakupModelData[0].OutWardJourney.sort((a, b) => a.JourneyFareTypeDup1 > b.JourneyFareTypeDup1 ? 1 : -1)
   this.shareData.emit(this.totalFare/100);
}


selectSingleReturnJourney(_element:any,expendedState:boolean)
{  
  
  this.ReturnJourneyFareSelectedRow=-1;
  if(expendedState == true){     
    this.GetJourneyFare(_element,null,"R");
     let element : HTMLElement =document.getElementById("tblOutwardOpenPureReturnFare") as HTMLElement;
     if(element != null && element.children[1] != null){
         element.children[1].childNodes.forEach(item => {
         if(item.childNodes.length != 0 && (item as HTMLElement).className.includes("expanded-row")){
                 (item as HTMLElement).click();
         }
   });
 }
  }
  else if(expendedState == false){
    if(this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => (!h.JourneyFareType.includes("Outward and Return")) && (!h.JourneyFareTypeDup1.includes("Outward and Return"))  && (!h.JourneyFareTypeDup2.includes("Outward and Return"))).length != 0 )
    {
    this.totalFare = 0;
    this.sharedService.fareBreakupModelData[0].OutWardJourney = this.sharedService.fareBreakupModelData[0].OutWardJourney.filter( h => (!h.JourneyFareType.includes("Return")) && (!h.JourneyFareTypeDup1.includes("Return"))  && (!h.JourneyFareTypeDup2.includes("Return")));
    this.sharedService.fareBreakupModelData.forEach(obj=>{
      obj.OutWardJourney.forEach(objout=>{
        this.totalFare += objout.FareBreakup.totalFare;
      });
      this.shareData.emit(this.totalFare/100);
    });
  }
  }
}


}



