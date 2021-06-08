import { Component, OnInit, Input } from '@angular/core';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { SharedService } from 'src/app/Services/shared.service';
import { ResponseData } from 'src/app/models/common/response';
import { StorageDataService } from 'src/app/Services/SharedCache.service';
import { AddNectarCardRequest } from 'src/app/models/customer/add-nectarCard-request';
import {FormControl,  Validators, FormGroup} from '@angular/forms';
import { SessionExpiredComponent } from 'src/app/Component/session-expired/session-expired.component';
import { MatDialog } from '@angular/material';
import { AlertMessage } from 'src/app/models/common/alert-message';
@Component({
  selector: 'app-nectarcard',
  templateUrl: './nectarcard.component.html',
  styleUrls: ['./nectarcard.component.css',
  '../reviewandbuy.component.css']
})
export class NectarcardComponent implements OnInit {
  NectarCardRequest : string;
  LoyaltyCardNumber : string = "";

  responseData : ResponseData;
  AddNectarCardResponseMessage : string;
  AddNectarCardRequest : AddNectarCardRequest;
  NectarCardForm: FormGroup;
  AlertMessageBody : AlertMessage;
  IsUserLoggedIn : boolean = false;
  nectarValue : number = 0;
  ShowLoggedInNectarCardNumber : boolean = false;
  constructor(public dialog :  MatDialog, public sharedService : SharedService, public sharedServiceStorage : StorageDataService, public customerService: CustomerServiceService) {
    this.AddNectarCardRequest = new AddNectarCardRequest();
    this.AlertMessageBody = new AlertMessage();
    this.NectarCardForm = new FormGroup({
      CardNumber: new FormControl('', [Validators.minLength(11), Validators.maxLength(11) ])
  
    });
    
   }
  
  ngOnInit() {
    if(this.sharedServiceStorage.getStorageData('storedAllServices', true) !=null)
    {
      if( localStorage.getItem("customerId")!=null)
      {
        this.IsUserLoggedIn = true;
      }
      this.sharedService = this.sharedServiceStorage.getStorageData('storedAllServices', true)
      this.nectarValue = this.sharedService.NectarPointsEarned;
      if(this.sharedService.NectarCardData != null)
      {
        if(this.sharedService.NectarCardData.loyaltycardnumber != null)
        {
          this.LoyaltyCardNumber =  this.sharedService.NectarCardData.loyaltycardnumber;
        }
      }
      if(this.IsUserLoggedIn == true && this.LoyaltyCardNumber != null && this.LoyaltyCardNumber != "")
      {
        this.ShowLoggedInNectarCardNumber = true;
      }
      else if(this.IsUserLoggedIn == true && (this.LoyaltyCardNumber == null || this.LoyaltyCardNumber == ""))
      {
        this.ShowLoggedInNectarCardNumber = false;
      }
    
    }
   
    
  }
  
  AddNectarCard()
  { 
    if(this.NectarCardForm.value.CardNumber != "" && this.NectarCardForm.valid)
      this.AddNectarCardRequest.loyaltyCardNumber = this.NectarCardForm.value.CardNumber;
    else
      this.AddNectarCardRequest.loyaltyCardNumber = this.LoyaltyCardNumber;
    this.AddNectarCardRequest.sessionid = localStorage.getItem('sessioncode');
    this.AddNectarCardRequest.schemeType = 'N';
    if(this.LoyaltyCardNumber != "" )
      this.AddNectarCardRequest.addNectarCardEventContext = 'ExistingUser';
    else
      this.AddNectarCardRequest.addNectarCardEventContext = 'RegisterUser';
  
    this.customerService.addNectarCard(this.AddNectarCardRequest).subscribe(
      res=>{
            if(res!= null)
              {
                this.responseData = res as ResponseData;
                if(this.responseData.responseCode == '200')
                  {
                    localStorage.setItem('sessioncode', this.responseData.sessionCode);
                    console.log("addNectarCard",this.responseData.sessionCode);
                    var data = this.responseData.data;
                    if(data.addnectarcardresponse.rhresponse.errors == null)
                      {
                        this.AlertMessageBody.isAlertMessage = true;
                        this.AddNectarCardResponseMessage = "Nectar Card Added Successfully!!";
                        this.AlertMessageBody.alertMessage = this.AddNectarCardResponseMessage;
                        this.sharedServiceStorage.setStorageData('alertMessageBody',this.AlertMessageBody, true);
                      } 
                    else
                      {
                        this.AlertMessageBody.isAlertMessage = true;
                        this.AddNectarCardResponseMessage =  data.addnectarcardresponse.rhresponse.errors[0].errordesc ;
                        if(this.AddNectarCardResponseMessage.includes('Invalid'))
                        {
                          this.AlertMessageBody.alertMessage = 'Entered card number is invalid. Please enter valid card number.';
                        }
                        else 
                          this.AlertMessageBody.alertMessage = this.AddNectarCardResponseMessage;
                        this.sharedServiceStorage.setStorageData('alertMessageBody',this.AlertMessageBody, true);
                      }
                      this.dialog.open(SessionExpiredComponent, {
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                        width: '600px',
                        panelClass: 'session-expired'
                      });
                    }
              }
           });

  }
}
