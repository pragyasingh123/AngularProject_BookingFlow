import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSolutionService } from 'src/app/Services/search-solution.service';
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material/dialog';
import {RouteDetailsRequest}  from 'src/app/models/journey/route-details-request';
import {  RouteDetailsResponse, CallPoints } from 'src/app/models/journey/route-details-response';
import { ResponseData } from 'src/app/models/common/response';
import { SessionExpiredComponent } from 'src/app/Component/session-expired/session-expired.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertMessage } from 'src/app/models/common/alert-message';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { SharedService } from 'src/app/Services/shared.service';


@Component({
  selector: 'app-journey-detail',
  templateUrl: './journey-detail.component.html',
  styleUrls: ['./journey-detail.component.css']
})
export class JourneyDetailComponent implements OnInit {

  changes: number;
  duration:string;
 
  routeDetailsRequest: RouteDetailsRequest;
  routeDetailsResponse: RouteDetailsResponse;
  responseData: ResponseData;
  traveLChanges: RouteDetailsResponse[];
  showCallPoints : CallPoints[];
  AlertMessageBody : AlertMessage;
  IsErrorinResponse : boolean = false;
  ErrorMessage  :string;
  SourceStation : string;
  DestinationStation : string;

constructor(public sharedStorage: StorageDataService, public spinnerService: NgxSpinnerService, public dialog: MatDialog, private searchSolutionService: SearchSolutionService,
     @Inject(MAT_DIALOG_DATA) public data: any , public dialogRef: MatDialogRef<JourneyDetailComponent>,
     public sharedService: SharedService ){
       this.routeDetailsRequest = new RouteDetailsRequest;
       this.AlertMessageBody = new AlertMessage();
       }
ngOnInit() {
    this.routeDetailsRequest.TravelSolutionCode = this.data.TravelSolutionCode;
    this.routeDetailsRequest.TravelSolutionId = this.data.TravelSolutionId;
    this.routeDetailsRequest.TravelSolutionServiceId = this.data.TravelSolutionServiceId;
    this.changes = this.data.Changes;
    this.duration = this.data.Duration;

    this.getRouteDetailsData();
  }

getRouteDetailsData()
{
  this.spinnerService.show();
  this.searchSolutionService.getRouteDetails(this.routeDetailsRequest).subscribe(
    res => {
          if (res != null) {
            this.responseData = res as ResponseData;
            if (this.responseData.responseCode == '200') {
              localStorage.setItem('sessioncode', this.responseData.sessionCode);
              if(this.responseData.data.length == 0 || this.responseData.data[0].errorDetails !=null || this.responseData.data[0].callingPoints.length == 0  )
               {
              //   this.responseData.data.length = 0;
              //   if(this.responseData.data.length == 0)
              //   {
              //     this.AlertMessageBody.isAlertMessage = true;
              //     this.AlertMessageBody.alertMessage = "Sorry, No Route Details to Display";
              //     this.sharedStorage.setStorageData('alertMessageBody', this.AlertMessageBody, true);
              //   }
              //   this.dialogRef.close();
              //   this.spinnerService.hide();
              //   this.dialog.open(SessionExpiredComponent, {
              //     maxWidth: '95vw',
              //     maxHeight: '95vh',
              //     width: '600px',
              //     panelClass: 'session-expired'
              //   });
              //  return;
                this.IsErrorinResponse = true;
                this.ErrorMessage = 'Route details are not available right now, Please try later';
                if(this.sharedStorage.getStorageData('storedAllServices', true)!=null)
                {
                  this.sharedService=this.sharedStorage.getStorageData('storedAllServices', true);
                  this.SourceStation = this.sharedService.SourceStation;
                  this.DestinationStation = this.sharedService.DestinationStation;
                }
                this.sharedService.IsSessionExpired = true;
                this.sharedStorage.clearStorageData("storedAllServices");
                this.sharedStorage.setStorageData("storedAllServices",this.sharedService,true);
              }
              this.routeDetailsResponse = this.responseData.data as RouteDetailsResponse;
           
              this.traveLChanges= this.responseData.data;
              this.spinnerService.hide();
            }
            else {
              console.log(this.responseData.ResponseMessage);
            }
          }
   });
  
}


 onChangeCallingPoints(checked, change)
  {
    if(checked)
      change.callingPoints.showCallingPoints = true;
    else
      change.callingPoints.showCallingPoints= false;
  
  }


}



