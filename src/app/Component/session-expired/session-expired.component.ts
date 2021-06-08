import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchResultComponent } from 'src/app/Component/mixing-deck/search-result/search-result.component';
import { ModifyQttSearchExpendedComponent } from 'src/app/Component/mixing-deck/modify-qtt-search-expended/modify-qtt-search-expended.component';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { AlertMessage } from 'src/app/models/common/alert-message';
import { DatePipe } from '@angular/common';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { ReviewandbuyComponent } from '../reviewandbuy/reviewandbuy.component';
import { SigninComponent } from '../signin/signin.component';
import { SharedService } from 'src/app/Services/shared.service';
import { SeatReservedPlace } from 'src/app/models/review-and-buy/seat-reservation-response';
import { MixingDeckComponent } from '../mixing-deck/mixing-deck.component';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent implements OnInit {
  Adults : number;
  Children : number;
  Railcards : number;
  Outbound : string;
  SourceStation : String;
  DestintationStation : String;
  AlertMessageBody : AlertMessage;
  IsShowAlert : boolean;
  AlertMessage : string;
  splittedDate : string[];
  searchRequestModel : SearchRequestModel;
  IsLoginRequest : boolean = false;
  message:string;
  buttonText:string;
  IsSessionExpired : boolean = false;
  IsSeatReservationDetails : boolean = false;
  SeatReservationData : SeatReservedPlace[];
  constructor(public datePipe : DatePipe, public sharedStorage : StorageDataService, public router : Router,@Inject(MAT_DIALOG_DATA) private data: any
     ,public dialog: MatDialog, public ReviewBuy : ReviewandbuyComponent,public dialogRef: MatDialogRef<SessionExpiredComponent>
     , private sharedServiceData : SharedService, private MixingDeck : MixingDeckComponent) { 
       this.SeatReservationData = new Array<SeatReservedPlace>();
      if(data){
        this.message = data.message || this.message;
        }
     }

  ngOnInit() {
    if(this.sharedStorage.getStorageData('storedAllServices', true)!=null)
    {
       this.sharedServiceData = this.sharedStorage.getStorageData('storedAllServices', true);
    }
    if(localStorage.getItem('IsLoginPopUp') == 'Y')
    {
      localStorage.setItem('IsLoginPopUp', 'N');
      this.buttonText = 'Login';
      return;
    }
    if(this.sharedServiceData.IsSeatReservationData == true)
    {
      this.IsSeatReservationDetails = true;
      this.SeatReservationData = this.sharedServiceData.ReservedSeatData;
      this.SeatReservationData.forEach(element => {
        element.preferenceString = '';
        if(element.preferenceCode != null)
        {
          element.preferenceCode.forEach(obj => {
            element.preferenceString = element.preferenceString  + obj.prefValue + ",  ";
          });
          var lastChar = element.preferenceString.slice(-3);
          if (lastChar == ',  ')
          {
             element.preferenceString = element.preferenceString.slice(0, -3);
          }
        }
      });
      this.SourceStation  = this.sharedServiceData.SourceStation;
      this.DestintationStation = this.sharedServiceData.DestinationStation;
      this.sharedServiceData.IsSeatReservationData = false;
      this.sharedStorage.clearStorageData("storedAllServices");
      this.sharedStorage.setStorageData("storedAllServices",this.sharedServiceData,true);
      return;
    }
    this.AlertMessageBody= this.sharedStorage.getStorageData('alertMessageBody', true);
    if(this.AlertMessageBody != null)
      {
        if(this.AlertMessageBody.IsLoginRequest == true)
          this.IsLoginRequest = true;
        this.IsShowAlert = true;
        this.AlertMessage = this.AlertMessageBody.alertMessage;
        this.sharedStorage.setStorageData('alertMessageBody', null, true);

        return;
      }
    
    this.searchRequestModel = this.sharedStorage.getStorageData('searchrequest', true);
    this.Adults = this.searchRequestModel.adults;
    this.Children = this.searchRequestModel.Children;
    this.Railcards = this.searchRequestModel.passengergroup.length;
    this.Outbound  = this.datePipe.transform(this.searchRequestModel.datetimedepart, 'full');
    this.splittedDate = this.Outbound.split(",",3);
    this.Outbound = this.splittedDate[0] + " " + this.splittedDate[1] + ", depart after " + this.splittedDate[2].substring(9,14);
    this.SourceStation  = this.sharedServiceData.SourceStation;
    this.DestintationStation = this.sharedServiceData.DestinationStation;
    this.IsSessionExpired = true;
    this.sharedStorage.clearStorageData("storedAllServices");
    this.sharedStorage.setStorageData("storedAllServices",this.sharedServiceData,true);
  }

  openModifyQTTDialog(){
      // this.dialogRef.close();
      // const dialogRef=this.dialog.open(ModifyQttSearchExpendedComponent, {
      //   maxWidth: '100vw',
      //   maxHeight: '100vh',
      //   width: '100%',
      //   panelClass: 'journeyDialog'
      // });
      // dialogRef.componentInstance.expendedSearchRequest = this.searchRequestModel;
    this.dialogRef.close();
    localStorage.setItem("isRequestFromAnotherUrl","true");    
    this.sharedServiceData.isAmendSearchOpen = true;
    this.sharedServiceData.IsSessionExpired = true;
    this.sharedStorage.clearStorageData("storedAllServices");
    this.sharedStorage.setStorageData("storedAllServices",this.sharedServiceData,true);
    this.router.navigate([`./mixingdeck`]);
    //this.MixingDeck.ngOnInit();
    }

    LoginButtonClicked()
    {
      this.IsLoginRequest = true;
      this.sharedServiceData.IsLoginRequest = true;
      this.sharedStorage.clearStorageData("storedAllServices");
      this.sharedStorage.setStorageData("storedAllServices",this.sharedServiceData,true);
    }

    OnClickLogin()
    {
      const dialogRef = this.dialog.open(SigninComponent,{
        disableClose: false,
        maxWidth: '80vw',
        maxHeight: '90vh',
        width: '600px',
        });
        dialogRef.afterClosed().subscribe(res=>{
          if(res!=null){
            //  this.setJourneyForLater();
            // this.sharedService.saveForLaterJourneyRequest = this.saveForLaterJourneyRequest;
            // this.addJourneyForLater();
            localStorage.setItem('LoginresData', res);
          }
        });
      
      //this.ReviewBuy.ProceedToLogin();
    }

    // OnClickCancle()
    // {
    //   this.dialogRef.close();
    // }

}
