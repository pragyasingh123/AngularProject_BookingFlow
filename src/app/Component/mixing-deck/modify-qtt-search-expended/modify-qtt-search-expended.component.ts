import { Component, OnInit } from '@angular/core';
import { SearchRequestModel } from 'src/app/models/journey/search-request';
import { from } from 'rxjs';
import * as moment from 'moment';
import { startWith,map } from 'rxjs/operators';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocationResponseData } from 'src/app/models/locations/location-response-data';
import { Railcard } from 'src/app/models/journey/railcards/railcard';
import { CommonServiceService } from 'src/app/Services/common-service.service';
import { ResponseData } from 'src/app/models/common/response';
import { AngularMaterialModule } from 'src/app/material/material-module';
import { passengerCountValidator } from 'src/app/utility/custom-validations/Passenger-count-validation';
import { pastTimeValidator } from 'src/app/utility/custom-validations/past-time-validation';
import { RailCardModel } from 'src/app/models/journey/railcard.model';
import { childValidator } from 'src/app/utility/custom-validations/child-validation';
import { adultValidator } from 'src/app/utility/custom-validations/adult-validation';
import { railcardPerPassengerValidator } from 'src/app/utility/custom-validations/passenger-railcard-validation';
import { returnTimeValidator } from 'src/app/utility/custom-validations/return-time-validation';
import { SharedService } from 'src/app/Services/shared.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material';
import { debug } from 'util';
import { Router } from '@angular/router';
import { MixingDeckComponent } from '../mixing-deck.component';
import { StorageDataService } from 'src/app/Services/SharedCache.service';

//import * as moment from 'moment';
@Component({
  selector: 'app-modify-qtt-search-expended',
  templateUrl: './modify-qtt-search-expended.component.html',
  styleUrls: ['./modify-qtt-search-expended.component.css']
})
export class ModifyQttSearchExpendedComponent implements OnInit {

  public show:boolean = false;

  expendedSearchRequest: SearchRequestModel;
  mixingDeckcompo :MixingDeckComponent;
 
  qttFormSingle:FormGroup;
  qttFormReturn: FormGroup;
  qttFormOpenReturn: FormGroup;
  qttFormSeason: FormGroup;
  qttFormFlexi: FormGroup;
  locationRespnse: Observable<LocationResponseData[]>;
   filteredDeparturesSingle: Observable<LocationResponseData[]>;
  filteredArrivalsSingle: Observable<LocationResponseData[]>;
  filteredStationsSingle: Observable<LocationResponseData[]>;
  //filteredCardNamesSingle: Observable<RailCardModel[]>;

  filteredDeparturesReturn: Observable<LocationResponseData[]>;
  filteredArrivalsReturn: Observable<LocationResponseData[]>;
  filteredStationsReturn: Observable<LocationResponseData[]>;

  filteredDeparturesOpenReturn: Observable<LocationResponseData[]>;
  filteredArrivalsOpenReturn: Observable<LocationResponseData[]>;
  filteredStationsOpenReturn: Observable<LocationResponseData[]>;

  responseData:ResponseData;
  locations:LocationResponseData[];
  passengersCountReturn: any;
  passengersCountOpenReturn: any;
  prepopulatedTime: any;
  railcardsSingle: FormArray;
  railcardsReturn: FormArray;
  currentdate :string = moment(new Date()).format('YYYY-MM-DD');
  timeList: any = [];
  startingTime: number = 0;
  status: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = moment(this.minDate).add(6, 'months').toDate();
  currentTimeDepart:any;
  currentTimeReturn:any;
  tabIndex: number;
newDateTimedepart:any;
newDateTimereturn:any;

currentTime:any;
  
  d1 = new Date ();
d2 = new Date ( this.d1 );

//railCards:Railcard[];
railCards: RailCardModel[];

    
  // railCards = [ { code:'TSU' , name:'16-17 Saver'},
  // { code:'YNG' , name:'16-25 Saver'},
  // { code:'TST' , name:'26-30 Saver'},
  // { code:'NGC' , name:'Annual Gold Card'},
  // { code:'DIC' , name:'Disabled Child Railcard'},
  // { code:'DIS' , name:'Disabled Person Railcard'},
  // { code:'FAM' , name:'Family & Friends Railcard'},
  // { code:'HMF' , name:'HM forces Railcard'},
  // { code:'JCP' , name:'Job centre Plus Travel Discount'},
  // { code:'NEW' , name:'Network Railcard'},
  // { code:'SRN' , name:'Senior Railcard'},
  // { code:'2TR' , name:'Two Together Railcard'},
  // { code:'SRY' , name:'Young Scot National Entitlement Card'}]; 
        
  prepopulatedTimeReturn: any;
  prepopulatedDateReturn: any;
  adultReturn: number;
  childReturn: number;
  returnTravelType;
  isAmendFresh: boolean;
  isSeason: boolean = false;
  isFlexi: boolean = false;

  adultOpenReturn: number;
  childOpenReturn: number;
 
  checkReturnType: boolean = false;
  isTypeselectedSingle: boolean = true;
  railcardsOpenReturn: FormArray;
  
  //railCardList: RailCardList;
  isPluralAdultSingle: boolean = false;
  isPluralAdultReturn: boolean = false;
  isPluralAdultOpenReturn: boolean = false;

  isPluralChildSingle: boolean = false;
  isPluralChildReturn: boolean = false;
  isPluralChildOpenReturn: boolean = false;
  seasonDisable: boolean = false;
  isCustomChecked: boolean = false;
  
  constructor(private router: Router,private formbuilder: FormBuilder, private storageDataService:StorageDataService, public dialog:MatDialog,private dialogRef: MatDialogRef<ModifyQttSearchExpendedComponent>,private modalService: NgbModal,public activeModal: NgbActiveModal,private commonServiceService: CommonServiceService,private sharedService: SharedService) {
    for (var i = 0; this.startingTime < 24 * 60; i++) {
      var hh = Math.floor(this.startingTime / 60);
      var mm = (this.startingTime % 60);
      // this.timeList[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + " " + this.medians[Math.floor(hh / 12)];
      this.timeList[i] = ("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2);
      this.startingTime = this.startingTime + 15;
    }
    
    this.d2.setHours ( this.d1.getHours() + 2 );
    this.currentTime=moment(this.d2.getTime()).format('HH:mm');

  //   this.newDateTimedepart=new Date(this.expendedSearchRequest.datetimedepart);
  //   this.newDateTimereturn=new Date(this.expendedSearchRequest.datetimereturn);
  //  this.currentTimeDepart=moment(this.newDateTimedepart.getTime()).format('HH:mm');
  // this.currentTimeReturn=moment(this.newDateTimereturn.getTime()).format('HH:mm');
    }

   clickEvent() {
    this.status = !this.status;
  }
 

  // getRailCardNames()
  // {
  //    this.commonServiceService.getRailcards().subscribe(
  //  res => {
  //    if (res != null) {
  //          this.responseData = res as ResponseData;
  //          if (this.responseData.responseCode == '200') {
  //            this.railcards = this.responseData.data;
  //            this.initializeFormData();
  //          }
  //       else {
  //          console.log(this.responseData.ResponseMessage);
  //        }
  //      }
  //    });s

  
  ngOnInit() {
    debugger

     this.isAmendFresh = this.sharedService.isAmendFresh;
    // if (this.amendSearchRequest.TravelSolutionDirection == "SEASON") {
    //   this.isSeason = true;
    //   if (this.amendSearchRequest.IsCustom) {
    //     this.minEndDate = moment(this.amendSearchRequest.DepartureTimesStart).add(1, 'days').add(1, 'months').toDate();
    //     this.maxEndDate = moment(this.amendSearchRequest.DepartureTimesStart).add(12, 'months').toDate();
    //   }
    // }
    // else if (this.amendSearchRequest.TravelSolutionDirection == "FLEXI") {
    //   this.isFlexi = true;
    // }

   if (!this.isSeason && !this.isFlexi) {
     if (this.expendedSearchRequest.TravelSolutionDirection == "ONE_WAY") {

      //this.tabIndex = 0;

        if (this.sharedService.addReturnTabIndex) {
          this.tabIndex = 1;
          this.sharedService.addReturnTabIndex = null;
        }
        else {
          this.tabIndex = 0;
        }
     }
      else if (this.expendedSearchRequest.TravelSolutionDirection == "RETURN") {
         this.tabIndex = 1;
       }
       else {
         this.tabIndex = 2;
       }
       debugger
       this.adultSingle = this.expendedSearchRequest.adults;
       this.childSingle = this.expendedSearchRequest.Children;
       this.adultReturn = this.expendedSearchRequest.adults;
       this.childReturn = this.expendedSearchRequest.Children;
       this.adultOpenReturn = this.expendedSearchRequest.adults;
       this.childOpenReturn = this.expendedSearchRequest.Children;
      this.returnTravelType = this.expendedSearchRequest.TraveltypeReturn ? this.expendedSearchRequest.TraveltypeReturn : 'DEPARTAFTER';

      //For railcards

       this.commonServiceService.getRailcards().subscribe(
       data => {

         if (data != null) {
           this.responseData = data as ResponseData;
           if (this.responseData.responseCode == '200') {
            localStorage.setItem('sessioncode', this.responseData.sessionCode);
            localStorage.setItem('railcardslists',this.responseData.data);
            this.storageDataService.setStorageData("railCardList", this.responseData, true);
            //var data = this.responseData.data;
             this.sharedService.railcardsListResponseData = this.responseData.data;
             this.railCards = this.responseData.data;
           }
           else {
             console.log(this.responseData.ResponseMessage);
           }
         }
    //    // this.railCards = data as any [];		// FILL THE ARRAY WITH DATA.
       }
    
     );

    

  
      this.adultsForRailcards = this.adultSingle;
      this.adultForRailcardCount = this.adultsForRailcards;
      this.childsForRailcards = this.childSingle;
      this.childForRailcardCount = this.childsForRailcards;

      let requestedTime = moment(this.expendedSearchRequest.datetimedepart).format("HH:mm:ss");
      let tempTime = requestedTime.split(':');
      this.prepopulatedTime = tempTime[0] + ':' + tempTime[1];
//debugger
       if (this.expendedSearchRequest.IsReturnRequest) {
         let requestedTimeReturn = moment(this.expendedSearchRequest.datetimereturn).format("HH:mm:ss");
         let tempTimeReturn = requestedTimeReturn.split(':');
         this.prepopulatedTimeReturn = tempTimeReturn[0] + ':' + tempTimeReturn[1];
       }
      this.prepopulatedDate = moment(this.expendedSearchRequest.datetimedepart).format('YYYY-MM-DD');
      //debugger
       this.prepopulatedDateReturn = moment(this.expendedSearchRequest.datetimereturn).format('YYYY-MM-DD');
      this.passengersCountSingle = this.adultSingle + this.childSingle;
      this.passengersCountReturn = this.adultReturn + this.childReturn;
      this.passengersCountOpenReturn = this.adultOpenReturn + this.childOpenReturn;
    }

    this.createForms();

        if (!this.isSeason && !this.isFlexi) {
      this.railcardsSingle = this.qttFormSingle.get('railcardsSingle') as FormArray;
     this.railcardsReturn = this.qttFormReturn.get('railcardsReturn') as FormArray;
     this.railcardsOpenReturn = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
     }

    // else if(this.isSeason){
    //   this.railcardsSeason = this.qttFormSeason.get('railcardsSeason') as FormArray;
    //   if(this.amendSearchRequest.Adult){
    //     this.adultSeason = 1;
    //     this.childSeason = 0;
    //   }
    //   else {
    //     this.adultSeason = 0;
    //     this.childSeason = 1;
    //   }
    // }

   if (this.sharedService.locationResponseData.length > 0) {
       this.locations = this.sharedService.locationResponseData;
       this.initializeFormData();
      }
      else {
      this.getLocations();
     }

   
    //this.getLocations();



   // this.getRailCardNames();
    
  

  }

  openDate:any;
  openTime:any;
  openDepLoc:any;
  openArrLoc:any;

  onDateChangeOpenReturn(event) {
    this.qttFormOpenReturn.get('startTimeOpenReturn').setValidators([Validators.required, pastTimeValidator(event.target.value)]);
    this.qttFormOpenReturn.get('startTimeOpenReturn').updateValueAndValidity();

    this.openDate =this.qttFormOpenReturn.get('startDateOpenReturn').value;
    //this.qttFormOpenReturn.controls('startTimeOpenReturn').setValue(this.singleTime);
    this.qttFormReturn.patchValue({
      startDateReturn:this.openDate

    });

    this.qttFormSingle.patchValue({
      startDateSingle:this.openDate
    });
  }

  createRailcardGroupSingle(): FormGroup {
    return this.formbuilder.group({
      railCardCode: new FormControl(''),
      railcardCount: new FormControl({ value: 0, disabled: true }),
      railcardAdult: new FormControl({ value: 0, disabled: true }),
      railcardChild: new FormControl({ value: 0, disabled: true }),
  //railCardCode : new FormControl({ value: 0, disabled: true }) 
    });
  }

  createRailcardGroupReturn(): FormGroup {
    return this.formbuilder.group({
      railCardCode: new FormControl(''),
      railcardCount: new FormControl({ value: 0, disabled: true }),
      railcardAdult: new FormControl({ value: 0, disabled: true }),
      railcardChild: new FormControl({ value: 0, disabled: true }),
      //railCardCode : new FormControl({ value: 0, disabled: true }) 
    });
  }

  createRailcardGroupOpenReturn(): FormGroup {
    return this.formbuilder.group({
      railCardCode: new FormControl(''),
      railcardCount: new FormControl({ value: 0, disabled: true }),
      railcardAdult: new FormControl({ value: 0, disabled: true }),
      railcardChild: new FormControl({ value: 0, disabled: true }),
      //railCardCode : new FormControl({ value: 0, disabled: true }) 
    });
  }

  createForms(){
    //debugger
    this.qttFormSingle = this.formbuilder.group({
      departureLocationNameSingle: new FormControl('', [Validators.required]),
      arrivalLocationNameSingle: new FormControl('', [Validators.required]),
      pathConstraintLocationSingle: new FormControl(''),
      //railsSingle: new FormControl('', [Validators.required]),
      pathConstraintTypeSingle: new FormControl(''),
      //railcardNameSingle:new FormControl(''),
      travelTypeSingle: new FormControl('', [Validators.required]),
      
      startTimeSingle: new FormControl('', [Validators.required, pastTimeValidator(this.prepopulatedDate)]),
      adultCountSingle: new FormControl('', [passengerCountValidator(this.adultSingle, this.childSingle)]),
      startDateSingle: new FormControl('', [Validators.required]),
        childCountSingle: new FormControl('', [passengerCountValidator(this.adultSingle, this.childSingle)]),
        railcardsSingle: this.formbuilder.array([this.createRailcardGroupSingle()])
    });
debugger
    this.qttFormReturn = this.formbuilder.group({
      
      departureLocationNameReturn: new FormControl('', [Validators.required]),
      arrivalLocationNameReturn: new FormControl('', [Validators.required]),
      pathConstraintTypeReturn: new FormControl(''),
      pathConstraintLocationReturn: new FormControl(''),
      startDateReturn: new FormControl('', [Validators.required]),
      travelTypeReturn: new FormControl('', [Validators.required]),
      startTimeReturn: new FormControl('', [Validators.required, pastTimeValidator(this.prepopulatedDate)]),
      adultCountReturn: new FormControl('', [passengerCountValidator(this.adultReturn, this.childReturn)]),
      childCountReturn: new FormControl('', [passengerCountValidator(this.adultReturn, this.childReturn)]),
      railcardsReturn: this.formbuilder.array([this.createRailcardGroupReturn()]),
      returnDateReturn: new FormControl('', [Validators.required]),
      returnTravelTypeReturn: new FormControl('', [Validators.required]),
      returnTimeReturn: new FormControl('', [Validators.required, pastTimeValidator(this.prepopulatedDateReturn), returnTimeValidator(this.prepopulatedDateReturn, this.prepopulatedDate, this.prepopulatedTime)])
    });

    this.qttFormOpenReturn = this.formbuilder.group({
      departureLocationNameOpenReturn: new FormControl('', [Validators.required]),
      arrivalLocationNameOpenReturn: new FormControl('', [Validators.required]),
      pathConstraintTypeOpenReturn: new FormControl(''),
      pathConstraintLocationOpenReturn: new FormControl(''),
      startDateOpenReturn: new FormControl('', [Validators.required]),
      travelTypeOpenReturn: new FormControl('', [Validators.required]),
      startTimeOpenReturn: new FormControl('', [Validators.required, pastTimeValidator(this.prepopulatedDate)]),
      adultCountOpenReturn: new FormControl('', [passengerCountValidator(this.adultOpenReturn, this.childOpenReturn)]),
      childCountOpenReturn: new FormControl('', [passengerCountValidator(this.adultOpenReturn, this.childOpenReturn)]),
      railcardsOpenReturn: this.formbuilder.array([this.createRailcardGroupOpenReturn()])
    });
  }
  getLocations(){
  
    this.commonServiceService.getLocations().subscribe(
      res => {
        if (res != null) {
          this.responseData = res as ResponseData;
          if (this.responseData.responseCode == '200') {
            this.sharedService.locationResponseData = this.responseData.data;
            this.locations = this.responseData.data;
      
            this.initializeFormData();
          }
          else {
            console.log(this.responseData.ResponseMessage);
          }
        }

      });
      
  }

  // getRailcards(){
  //   this.commonServiceService.getRailcards().subscribe(
  //     res => {
  //       if (res != null) {
  //         this.responseData = res as ResponseData;
  //         if (this.responseData.responseCode == '200') {
  //           this.railcards = this.responseData.data;
  //           this.initializeFormData();
  //         }
  //         else {
  //           console.log(this.responseData.ResponseMessage);
  //         }
  //       }
  //     });
  // }

  ShowReturn(){

    this.show = true;
  }
  ShowSingle(){

this.show=false;
  }
  
  isSubmitted: boolean = false;
  result: SearchRequestModel = new SearchRequestModel();

  isAdultActionFresh: boolean = true;
  isChildActionFresh: boolean = true;
  currentRailcardIndex: number = 0;
  adultsForRailcards: number = 0;
  childsForRailcards: number = 0;
  adultSingle: number = 0;
  childSingle:number=0;
  adultsForRailcardAdult: number = 0;
  childForRailcardChild:number =0;
 
  passengersCountSingle: any;
  showGroupTravelLinkSingle: boolean = false;
  prepopulatedDate: any;
  isRailcardSelectedSingle: boolean = false;
  isRailcardCountSelectedSingle: boolean = false;
  numOfRailcardsSingle: number = 0;
  counts = Array.from(Array(10).keys());
  prevAdults: number;
  prevChilds: number;
  isAdultRailcardSelectedOpenReturn: boolean = false;
  isChildRailcardSelectedOpenReturn: boolean = false;

  adultChangeActionSingle(event) {
    if (!this.isAdultActionFresh && this.currentRailcardIndex !== 0) {
      this.adultsForRailcards += (event.value - this.adultSingle);
    }
    else {
      if (this.isAdultActionFresh) {
        this.adultsForRailcardAdult = event.value;
      }
      else {
        this.adultsForRailcardAdult += (event.value - this.adultSingle);
      }
      this.adultsForRailcards = event.value;

    }
    if (this.isAdultActionFresh) {
      this.isAdultActionFresh = false;
    }

    this.adultSingle = event.value;
    if (event.value < 2) {
      this.isPluralAdultSingle = false;
    }
    else {
      this.isPluralAdultSingle = true;
    }
    this.passengersCountSingle = this.adultSingle + this.childSingle;
    this.qttFormSingle.get('adultCountSingle').setValidators([passengerCountValidator(this.adultSingle, this.childSingle)]);
    this.qttFormSingle.get('adultCountSingle').updateValueAndValidity();
    this.qttFormSingle.get('childCountSingle').setValidators(null);
    this.qttFormSingle.get('childCountSingle').setErrors(null);
    if (this.passengersCountSingle > 9) {
      this.showGroupTravelLinkSingle = true;
    }
    else {
      this.showGroupTravelLinkSingle = false;
    }

    //For Railcards
    this.hideShowAddMoreButton(1);
    this.adultForRailcardCount = this.adultsForRailcards;
    if (this.isAdultRailcardSelected || this.isChildRailcardSelected || this.isRailcardCountSelectedSingle) {
      let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndex].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndex].get('railcardCount').value;
      if (this.isAdultRailcardSelected) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcard, this.adultsForRailcards, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelected) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcard, this.prevChilds, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedSingle) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsSingle, this.adultsForRailcards, this.prevChilds, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardCount').updateValueAndValidity();
      }
    }
  }
  adultChangeActionReturn(event) {
    if (!this.isAdultActionFreshReturn && this.currentRailcardIndexReturn !== 0) {
      this.adultsForRailcardsReturn += (event.value - this.adultReturn);
    }
    else {
      if (this.isAdultActionFreshReturn) {
        this.adultsForRailcardAdultReturn = event.value;
      }
      else {
        this.adultsForRailcardAdultReturn += (event.value - this.adultReturn);
      }
      this.adultsForRailcardsReturn = event.value;

    }
    if (this.isAdultActionFreshReturn) {
      this.isAdultActionFreshReturn = false;
    }
    this.adultReturn = event.value;
    if (event.value < 2) {
      this.isPluralAdultReturn = false;
    }
    else {
      this.isPluralAdultReturn = true;
    }
    this.passengersCountReturn = this.adultReturn + this.childReturn;
    this.qttFormReturn.get('adultCountReturn').setValidators([passengerCountValidator(this.adultReturn, this.childReturn)]);
    this.qttFormReturn.get('adultCountReturn').updateValueAndValidity();
    this.qttFormReturn.get('childCountReturn').setValidators(null);
    this.qttFormReturn.get('childCountReturn').setErrors(null);
    if (this.passengersCountReturn > 9) {
      this.showGroupTravelLinkReturn = true;
    }
    else {
      this.showGroupTravelLinkReturn = false;
    }

    //For Railcards
    this.hideShowAddMoreButton(2);
    this.adultForRailcardCountReturn = this.adultsForRailcardsReturn;
    if (this.isAdultRailcardSelectedReturn || this.isChildRailcardSelectedReturn || this.isRailcardCountSelectedReturn) {
      let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndexReturn].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').value;
      if (this.isAdultRailcardSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardReturn, this.adultsForRailcardsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardReturn, this.prevChildsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsReturn, this.adultsForRailcardsReturn, this.prevChildsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').updateValueAndValidity();
      }
    }
  }
  adultChangeActionOpenReturn(event) {
    if (!this.isAdultActionFreshOpenReturn && this.currentRailcardIndexOpenReturn !== 0) {
      this.adultsForRailcardsOpenReturn += (event.value - this.adultOpenReturn);
    }
    else {
      if (this.isAdultActionFreshOpenReturn) {
        this.adultsForRailcardAdultOpenReturn = event.value;
      }
      else {
        this.adultsForRailcardAdultOpenReturn += (event.value - this.adultOpenReturn);
      }
      this.adultsForRailcardsOpenReturn = event.value;

    }
    if (this.isAdultActionFreshOpenReturn) {
      this.isAdultActionFreshOpenReturn = false;
    }
    this.adultOpenReturn = event.value;
    if (event.value < 2) {
      this.isPluralAdultOpenReturn = false;
    }
    else {
      this.isPluralAdultOpenReturn = true;
    }
    this.passengersCountOpenReturn = this.adultOpenReturn + this.childOpenReturn;
    this.qttFormOpenReturn.get('adultCountOpenReturn').setValidators([passengerCountValidator(this.adultOpenReturn, this.childOpenReturn)]);
    this.qttFormOpenReturn.get('adultCountOpenReturn').updateValueAndValidity();
    this.qttFormOpenReturn.get('childCountOpenReturn').setValidators(null);
    this.qttFormOpenReturn.get('childCountOpenReturn').setErrors(null);
    if (this.passengersCountOpenReturn > 9) {
      this.showGroupTravelLinkOpenReturn = true;
    }
    else {
      this.showGroupTravelLinkOpenReturn = false;
    }

    //For Railcards
    this.hideShowAddMoreButton(3);
    this.adultForRailcardCountOpenReturn = this.adultsForRailcardsOpenReturn;
    if (this.isAdultRailcardSelectedOpenReturn || this.isChildRailcardSelectedOpenReturn || this.isRailcardCountSelectedOpenReturn) {
      let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').value;
      if (this.isAdultRailcardSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardOpenReturn, this.adultsForRailcardsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardOpenReturn, this.prevChildsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsOpenReturn, this.adultsForRailcardsOpenReturn, this.prevChildsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').updateValueAndValidity();
      }
    }
  }
  childChangeActionSingle(event) {
    if (event.value < 2) {
      this.isPluralChildSingle = false;
    }
    else {
      this.isPluralChildSingle = true;
    }

    if (!this.isChildActionFresh && this.currentRailcardIndex !== 0) {
      this.childsForRailcards += (event.value - this.childSingle);
    }
    else {
      if (this.isChildActionFresh) {
        //this.checkForAddAdult = true;
        this.childForRailcardChild = event.value;
      }
      else {
        this.childForRailcardChild += (event.value - this.childSingle);
      }
      this.childsForRailcards = event.value;
    }
    if (this.isChildActionFresh) {
      this.isChildActionFresh = false;
    }

    this.childSingle = event.value;
    this.passengersCountSingle = this.adultSingle + this.childSingle;
    this.qttFormSingle.get('childCountSingle').setValidators([passengerCountValidator(this.adultSingle, this.childSingle)]);
    this.qttFormSingle.get('childCountSingle').updateValueAndValidity();
    this.qttFormSingle.get('adultCountSingle').setValidators(null);
    this.qttFormSingle.get('adultCountSingle').setErrors(null);
    if (this.passengersCountSingle > 9) {
      this.showGroupTravelLinkSingle = true;
    }
    else {
      this.showGroupTravelLinkSingle = false;
    }

    //For Railcard
    this.hideShowAddMoreButton(1);
    this.childForRailcardCount = this.childsForRailcards;
    if (this.isAdultRailcardSelected || this.isChildRailcardSelected || this.isRailcardCountSelectedSingle) {
      let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndex].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndex].get('railcardCount').value;
      if (this.isAdultRailcardSelected) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcard, this.prevAdults, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelected) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcard, this.childsForRailcards, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedSingle) {
        arrayControl.controls[this.currentRailcardIndex].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsSingle, this.prevAdults, this.childsForRailcards, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndex].get('railcardCount').updateValueAndValidity();
      }
    }
  }
  childChangeActionReturn(event) {
    if (event.value < 2) {
      this.isPluralChildReturn = false;
    }
    else {
      this.isPluralChildReturn = true;
    }
    if (!this.isChildActionFreshReturn && this.currentRailcardIndexReturn !== 0) {
      this.childsForRailcardsReturn += (event.value - this.childReturn);
    }
    else {
      if (this.isChildActionFreshReturn) {
        //this.checkForAddAdult = true;
        this.childForRailcardChildReturn = event.value;
      }
      else {
        this.childForRailcardChildReturn += (event.value - this.childReturn);
      }
      this.childsForRailcardsReturn = event.value;
    }
    if (this.isChildActionFreshReturn) {
      this.isChildActionFreshReturn = false;
    }
    this.childReturn = event.value;
    this.passengersCountReturn = this.adultReturn + this.childReturn;
    this.qttFormReturn.get('childCountReturn').setValidators([passengerCountValidator(this.adultReturn, this.childReturn)]);
    this.qttFormReturn.get('childCountReturn').updateValueAndValidity();
    this.qttFormReturn.get('adultCountReturn').setValidators(null);
    this.qttFormReturn.get('adultCountReturn').setErrors(null);
    if (this.passengersCountReturn > 9) {
      this.showGroupTravelLinkReturn = true;
    }
    else {
      this.showGroupTravelLinkReturn = false;
    }

    //For Railcard
    this.hideShowAddMoreButton(2);
    this.childForRailcardCountReturn = this.childsForRailcardsReturn;
    if (this.isAdultRailcardSelectedReturn || this.isChildRailcardSelectedReturn || this.isRailcardCountSelectedReturn) {
      let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndexReturn].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').value;
      if (this.isAdultRailcardSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardReturn, this.prevAdultsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardReturn, this.childsForRailcardsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedReturn) {
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsReturn, this.prevAdultsReturn, this.childsForRailcardsReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexReturn].get('railcardCount').updateValueAndValidity();
      }
    }
  }
  childChangeActionOpenReturn(event) {
    if (event.value < 2) {
      this.isPluralChildOpenReturn = false;
    }
    else {
      this.isPluralChildOpenReturn = true;
    }
    if (!this.isChildActionFreshOpenReturn && this.currentRailcardIndexOpenReturn !== 0) {
      this.childsForRailcardsOpenReturn += (event.value - this.childOpenReturn);
    }
    else {
      if (this.isChildActionFreshOpenReturn) {
        //this.checkForAddAdult = true;
        this.childForRailcardChildOpenReturn = event.value;
      }
      else {
        this.childForRailcardChildOpenReturn += (event.value - this.childOpenReturn);
      }
      this.childsForRailcardsOpenReturn = event.value;
    }
    if (this.isChildActionFreshOpenReturn) {
      this.isChildActionFreshOpenReturn = false;
    }
    this.childOpenReturn = event.value;
    this.passengersCountOpenReturn = this.adultOpenReturn + this.childOpenReturn;
    this.qttFormOpenReturn.get('childCountOpenReturn').setValidators([passengerCountValidator(this.adultOpenReturn, this.childOpenReturn)]);
    this.qttFormOpenReturn.get('childCountOpenReturn').updateValueAndValidity();
    this.qttFormOpenReturn.get('adultCountOpenReturn').setValidators(null);
    this.qttFormOpenReturn.get('adultCountOpenReturn').setErrors(null);
    if (this.passengersCountOpenReturn > 9) {
      this.showGroupTravelLinkOpenReturn = true;
    }
    else {
      this.showGroupTravelLinkOpenReturn = false;
    }

    //For Railcard
    this.hideShowAddMoreButton(3);
    this.childForRailcardCountOpenReturn = this.childsForRailcardsOpenReturn;
    if (this.isAdultRailcardSelectedOpenReturn || this.isChildRailcardSelectedOpenReturn || this.isRailcardCountSelectedOpenReturn) {
      let arrayControl = this.qttFormOpenReturn.get('railcardsReturn') as FormArray;
      let selectedRailcard = arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railCardCode').value;
      let currentRailcardCount = arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').value;
      if (this.isAdultRailcardSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardOpenReturn, this.prevAdultsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardOpenReturn, this.childsForRailcardsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardChild').updateValueAndValidity();
      }
      if (this.isRailcardCountSelectedOpenReturn) {
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsOpenReturn, this.prevAdultsOpenReturn, this.childsForRailcardsOpenReturn, selectedRailcard, currentRailcardCount)]);
        arrayControl.controls[this.currentRailcardIndexOpenReturn].get('railcardCount').updateValueAndValidity();
      }
    }
  }

  railcardCompleted: boolean = false;

  addRailcardSingle(): void {
    this.isRailcardSelectedSingle = false;
    this.isRailcardCountSelectedSingle = false;
    this.isAdultRailcardSelected = false;
    this.isChildRailcardSelected = false;
    this.isRailcardsCountErrorFree = false;
    this.isRailcardsAdultErrorFree = false;
    this.isRailcardsChildErrorFree = false;
    this.railcardsSingle = this.qttFormSingle.get('railcardsSingle') as FormArray;
    this.railcardsSingle.push(this.createRailcardGroupSingle());
    // this.adultForRailcardCount = this.remainingAdult;
    // this.childForRailcardCount = this.remainingChild;
  }

  addRailcardReturn(): void {
    this.isRailcardSelectedReturn = false;
    this.isRailcardCountSelectedReturn = false;
    this.isAdultRailcardSelectedReturn = false;
    this.isChildRailcardSelectedReturn = false;
    this.isRailcardsCountErrorFreeReturn = false;
    this.isRailcardsAdultErrorFreeReturn = false;
    this.isRailcardsChildErrorFreeReturn = false;
    this.railcardsReturn = this.qttFormReturn.get('railcardsReturn') as FormArray;
    this.railcardsReturn.push(this.createRailcardGroupReturn());
  }

  addRailcardOpenReturn(): void {
    this.isRailcardSelectedOpenReturn = false;
    this.isRailcardCountSelectedOpenReturn = false;
    this.isAdultRailcardSelectedOpenReturn = false;
    this.isChildRailcardSelectedOpenReturn = false;
    this.isRailcardsCountErrorFreeOpenReturn = false;
    this.isRailcardsAdultErrorFreeOpenReturn = false;
    this.isRailcardsChildErrorFreeOpenReturn = false;
    this.railcardsOpenReturn = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    this.railcardsOpenReturn.push(this.createRailcardGroupOpenReturn());
  }

  getRemainingAdults(index, num): number {
    let remainingAdults = 0;
    this.setSearchRequestRailcards(num);
    if (this.expendedSearchRequest.passengergroup.length > 0) {
      let totalAdults = 0;
      let count = 0;
      this.expendedSearchRequest.passengergroup.forEach(m => {
        if (index != count) {
          totalAdults = totalAdults + m.adults;
        }
        count++;
      });
      if (num == 1) {
        remainingAdults = this.adultSingle - totalAdults;
      }
       else if (num == 2) {
         remainingAdults = this.adultReturn - totalAdults;
       }
       else if (num == 3) {
         remainingAdults = this.adultOpenReturn - totalAdults;
       }
      // else if (num == 4) {
      //   remainingAdults = this.adultSeason - totalAdults;
      // }
    }
    return remainingAdults;
  }

  getRemainingChilds(index, num): number {
    let remainingChilds = 0;
    this.setSearchRequestRailcards(num);
    if (this.expendedSearchRequest.passengergroup.length > 0) {
      let totalChilds = 0;
      let count = 0;
      this.expendedSearchRequest.passengergroup.forEach(m => {
        if (index != count) {
          totalChilds = totalChilds + m.Children;
          count++;
        }
      });

      if (num == 1) {
        remainingChilds = this.childSingle - totalChilds;
      }
       else if (num == 2) {
         remainingChilds = this.childReturn - totalChilds;
       }
       else if (num == 3) {
         remainingChilds = this.childOpenReturn - totalChilds;
      }
      // else if (num == 4) {
      //   remainingChilds = this.childSeason - totalChilds;
      // }
    }
    return remainingChilds;
  }

  setRemainingRailcards(num) {
    this.setSearchRequestRailcards(num);
    if (this.expendedSearchRequest.passengergroup.length > 0) {
      let totalAdults = 0;
      let totalChilds = 0;
      this.expendedSearchRequest.passengergroup.forEach(m => {
        totalAdults = totalAdults + m.adults;
        totalChilds = totalChilds + m.Children;
      });
      if (num == 1) {
        this.adultForRailcardCount = this.adultSingle - totalAdults;
        this.adultsForRailcardAdult = this.adultSingle - totalAdults;
        this.childForRailcardCount = this.childSingle - totalAdults;
        this.childForRailcardChild = this.childSingle - totalAdults;
      }
      else if (num == 2) {
        this.adultForRailcardCount = this.adultReturn - totalAdults;
        this.adultsForRailcardAdult = this.adultReturn - totalAdults;
        this.childForRailcardCount = this.childReturn - totalAdults;
        this.childForRailcardChild = this.childReturn - totalAdults;
      }
      // else if (num == 3) {
      //   this.adultForRailcardCount = this.adultOpenReturn - totalAdults;
      //   this.adultsForRailcardAdult = this.adultOpenReturn - totalAdults;
      //   this.childForRailcardCount = this.childOpenReturn - totalAdults;
      //   this.childForRailcardChild = this.childOpenReturn - totalAdults;
      // }
    }
  }
  tempReturn: any;
  
  prevAdultsReturn: number;
  prevChildsReturn: number;
  // prevAdultsOpenReturn: number;
  // prevChildsOpenReturn: number;
  adultForRailcardCount: number;
  childForRailcardCount: number;
  adultForRailcardCountReturn: number;
  childForRailcardCountReturn: number;
  adultForRailcardCountOpenReturn: number;
  childForRailcardCountOpenReturn: number;
  showRemoveSingle: boolean = false;
  showRemoveReturn: boolean = false;

  adultChangeRailcards(index, event) {
    this.railcardCompleted = false;
    this.selectedAdultsRailcard = event.value;
    if (!this.isAdultRailcardSelected) {
      this.adultsForRailcardAdult = this.adultForRailcardCount;
      this.isAdultRailcardSelected = true;
    }
    let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcard, this.adultsForRailcardAdult, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
    this.adultsForRailcardAdult = this.getRemainingAdults(index, 1);
    if (this.qttFormSingle.get(['railcardsSingle', index, 'railcardCount']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardAdult']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardChild']).errors == null) {
      this.railcardCompleted = true;
    }
    this.hideShowAddMoreButton(1);
  }
  adultChangeRailcardsReturn(index, event) {
    this.railcardCompletedReturn = false;
    this.selectedAdultsRailcardReturn = event.value;
    if (!this.isAdultRailcardSelectedReturn) {
      this.adultsForRailcardAdultReturn = this.adultForRailcardCountReturn;
      this.isAdultRailcardSelectedReturn = true;
    }
    let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardReturn, this.adultsForRailcardAdultReturn, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
    this.adultsForRailcardAdultReturn = this.getRemainingAdults(index, 2);
    if (this.qttFormReturn.get(['railcardsReturn', index, 'railcardCount']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardAdult']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedReturn = true;
    }
    this.hideShowAddMoreButton(2);
  }
  adultChangeRailcardsOpenReturn(index, event) {
    this.railcardCompletedOpenReturn = false;
    this.selectedAdultsRailcardOpenReturn = event.value;
    if (!this.isAdultRailcardSelectedOpenReturn) {
      this.adultsForRailcardAdultOpenReturn = this.adultForRailcardCountOpenReturn;
      this.isAdultRailcardSelectedOpenReturn = true;
    }
    let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardOpenReturn, this.adultsForRailcardAdultOpenReturn, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
    this.adultsForRailcardAdultOpenReturn = this.getRemainingAdults(index, 3);
    if (this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardCount']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardAdult']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedOpenReturn = true;
    }
    this.hideShowAddMoreButton(3);
  }
  childChangeRailcards(index, event) {
    this.railcardCompleted = false;
    let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
    this.selectedChildsRailcard = event.value;
    if (!this.isChildRailcardSelected) {
      this.childForRailcardChild = this.childForRailcardCount;
      this.isChildRailcardSelected = true;
    }
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcard, this.childForRailcardChild, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
    this.childForRailcardChild = this.getRemainingChilds(index, 1);
    if (this.qttFormSingle.get(['railcardsSingle', index, 'railcardCount']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardAdult']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardChild']).errors == null) {
      this.railcardCompleted = true;
    }
    this.hideShowAddMoreButton(1);
  }

  childChangeRailcardsReturn(index, event) {
    this.railcardCompletedReturn = false;
    let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
    this.selectedChildsRailcardReturn = event.value;
    if (!this.isChildRailcardSelectedReturn) {
      this.childForRailcardChildReturn = this.childForRailcardCountReturn;
      this.isChildRailcardSelectedReturn = true;
    }
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardReturn, this.childForRailcardChildReturn, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
    this.childForRailcardChildReturn = this.getRemainingChilds(index, 2);
    if (this.qttFormReturn.get(['railcardsReturn', index, 'railcardCount']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardAdult']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedReturn = true;
    }
    this.hideShowAddMoreButton(2);
  }
  childChangeRailcardsOpenReturn(index, event) {
    this.railcardCompletedOpenReturn = false;
    let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    this.selectedChildsRailcardOpenReturn = event.value;
    if (!this.isChildRailcardSelectedOpenReturn) {
      this.childForRailcardChildOpenReturn = this.childForRailcardCountOpenReturn;
      this.isChildRailcardSelectedOpenReturn = true;
    }
    let selectedRailcard = arrayControl.controls[index].get('railCardCode').value;
    let selectedRailcardCount = arrayControl.controls[index].get('railcardCount').value;
    arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardOpenReturn, this.childForRailcardChildOpenReturn, selectedRailcard, selectedRailcardCount)]);
    arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
    this.childForRailcardChildOpenReturn = this.getRemainingChilds(index, 3);
    if (this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardCount']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardAdult']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedOpenReturn = true;
    }
    this.hideShowAddMoreButton(3);
  }
  isAdultActionFreshReturn: boolean = true;
  isChildActionFreshReturn: boolean = true;
  isAdultActionFreshOpenReturn: boolean = true;
  isChildActionFreshOpenReturn: boolean = true;
  adultsForRailcardsReturn: number = 0;
  childsForRailcardsReturn: number = 0;
  adultsForRailcardsOpenReturn: number = 0;
  childsForRailcardsOpenReturn: number = 0;
  checkForAddAdult: boolean = false;

  convertDateTime(queryDate: any, queryTime: any) {
    //debugger
    let actualTime = queryTime.split(':');
    let dateString;
    dateString = moment(queryDate).add(actualTime[0], 'hours').add(actualTime[1], 'minutes').add(actualTime[2], 'seconds').format('YYYY-MM-DDTHH:mm:ss');
    return dateString;
  }

  onClickSubmit(group) {
    debugger
 
    this.sharedService.isAmendSearchOpen = false;
    this.result = this.expendedSearchRequest;
    this.result.passengergroup = new Array<RailCardModel>();
    if (group === this.qttFormSingle) {
      if (this.qttFormSingle.valid) {
        this.isSubmitted = true;
        this.result.DepartureLocationName = this.qttFormSingle.get('departureLocationNameSingle').value;
        this.result.locfrom = this.findLocationCode(this.qttFormSingle.get('departureLocationNameSingle').value);
        
        this.result.ArrivalLocationName = this.qttFormSingle.get('arrivalLocationNameSingle').value;
        this.result.locto = this.findLocationCode(this.qttFormSingle.get('arrivalLocationNameSingle').value);
        //this.result.railcardNames = this.qttFormSingle.get('railcardName').value;
        this.result.adults = this.qttFormSingle.get('adultCountSingle').value;
        this.result.Children = this.qttFormSingle.get('childCountSingle').value;
        this.result.Traveltype = this.qttFormSingle.get('travelTypeSingle').value;
        this.result.datetimedepart = this.convertDateTime(this.qttFormSingle.get('startDateSingle').value, this.qttFormSingle.get('startTimeSingle').value);
        let pathConstraint = this.qttFormSingle.get('pathConstraintTypeSingle').value;
        if (pathConstraint != "" && pathConstraint != undefined) {
          this.result.PathConstraintLocation = this.findLocationCode(this.qttFormSingle.get('pathConstraintLocationSingle').value);
          this.result.PathConstraintType = this.qttFormSingle.get('pathConstraintTypeSingle').value;
          this.sharedService.isAmendFresh = false;
           }
           this.result.Traveltype = this.qttFormSingle.get('travelTypeSingle').value;
           this.result.IsReturnRequest = false;
           this.result.TravelSolutionDirection = 'ONE_WAY';
           //this.result.datetimereturn = "";
           let totalAdults=this.result.adults;
           let totalchildrens= this.result.Children;
           let hasRailcards=false;
           this.result.passengergroup= new Array<RailCardModel>();
           this.railcardsSingle.controls.forEach(controls => {
            let railcardModel = new RailCardModel();
            if(controls.get('railCardCode').value!=""){
              railcardModel.Children = controls.get('railcardChild').value;
              //railcardModel.RailCard = controls.get('railcardName').value;
              railcardModel.numberofrailcards = controls.get('railcardCount').value;
              railcardModel.adults = controls.get('railcardAdult').value;
              railcardModel.RailCardCode=controls.get('railCardCode').value;
              hasRailcards=false;
              if (railcardModel.adults != 0 || railcardModel.Children != 0) {
                this.result.passengergroup.push(railcardModel);
              
              }
              totalAdults=totalAdults-railcardModel.adults;
              totalchildrens=totalchildrens-railcardModel.Children;
            }
          
          });
          if((!hasRailcards) &&(totalAdults>0 || totalchildrens>0)){
            let railcardModel = new RailCardModel();
            railcardModel.Children = totalchildrens;
            //railcardModel.RailCard = controls.get('railcardName').value;
            railcardModel.numberofrailcards = 0;
            railcardModel.adults = totalAdults;
            railcardModel.RailCardCode="";
            hasRailcards=true;
            if (railcardModel.adults != 0 || railcardModel.Children != 0) {
              this.result.passengergroup.push(railcardModel);
            
            }
          }
        
          this.dialogRef.close(this.result);
          //this.activeModal.close(this.result);
        
      }
    }

    else if (group === this.qttFormReturn) {
      if (this.qttFormReturn.valid) {
        this.isSubmitted = true;
        this.result.DepartureLocationName = this.qttFormReturn.get('departureLocationNameReturn').value;
       this.result.locfrom = this.findLocationCode(this.qttFormReturn.get('departureLocationNameReturn').value);
        this.result.ArrivalLocationName = this.qttFormReturn.get('arrivalLocationNameReturn').value;
        this.result.locto = this.findLocationCode(this.qttFormReturn.get('arrivalLocationNameReturn').value);
        this.result.datetimedepart = this.convertDateTime(this.qttFormReturn.get('startDateReturn').value, this.qttFormReturn.get('startTimeReturn').value);
        this.result.adults = this.qttFormReturn.get('adultCountReturn').value;
        this.result.Children = this.qttFormReturn.get('childCountReturn').value;
        let pathConstraintReturn = this.qttFormReturn.get('pathConstraintTypeReturn').value;
        if (pathConstraintReturn != "" && pathConstraintReturn != undefined) {
          this.result.PathConstraintLocation = this.findLocationCode(this.qttFormReturn.get('pathConstraintLocationReturn').value);
          this.result.PathConstraintType = this.qttFormReturn.get('pathConstraintTypeReturn').value;
           this.sharedService.isAmendFresh = false;
        }
        this.result.Traveltype = this.qttFormReturn.get('travelTypeReturn').value;
        this.result.TraveltypeReturn = this.qttFormReturn.get('returnTravelTypeReturn').value;
        this.result.IsReturnRequest = true;
        this.result.TravelSolutionDirection = 'RETURN';
        this.result.datetimereturn = this.convertDateTime(this.qttFormReturn.get('returnDateReturn').value, this.qttFormReturn.get('returnTimeReturn').value);
        let totalAdults=this.result.adults;
        let totalchildrens= this.result.Children;
        let hasRailcards=false;
        this.railcardsReturn.controls.forEach(controls => {
          let railcardModel = new RailCardModel();
          if(controls.get('railCardCode').value!=""){
          railcardModel.Children = controls.get('railcardChild').value;
          //railcardModel.RailCard = controls.get('railcardName').value;
          railcardModel.numberofrailcards= controls.get('railcardCount').value;
          railcardModel.adults = controls.get('railcardAdult').value;
          railcardModel.RailCardCode=controls.get('railCardCode').value;
          hasRailcards=false;
          if (railcardModel.adults != 0 || railcardModel.Children != 0) {
            this.result.passengergroup.push(railcardModel);
          }
          totalAdults=totalAdults-railcardModel.adults;
              totalchildrens=totalchildrens-railcardModel.Children;
            }
        });

        if((!hasRailcards) &&(totalAdults>0 || totalchildrens>0)){
          let railcardModel = new RailCardModel();
          railcardModel.Children = totalchildrens;
          //railcardModel.RailCard = controls.get('railcardName').value;
          railcardModel.numberofrailcards = 0;
          railcardModel.adults = totalAdults;
          railcardModel.RailCardCode="";
          hasRailcards=true;
          if (railcardModel.adults != 0 || railcardModel.Children != 0) {
            this.result.passengergroup.push(railcardModel);
          
          }
        }
       
       this.dialogRef.close(this.result);
        
      }
    }
    
    else {
      if (this.qttFormOpenReturn.valid) {
        this.isSubmitted = true;
        this.result.DepartureLocationName = this.qttFormOpenReturn.get('departureLocationNameOpenReturn').value;
        this.result.locfrom = this.findLocationCode(this.qttFormOpenReturn.get('departureLocationNameOpenReturn').value);
        this.result.ArrivalLocationName = this.qttFormOpenReturn.get('arrivalLocationNameOpenReturn').value;
        this.result.locto = this.findLocationCode(this.qttFormOpenReturn.get('arrivalLocationNameOpenReturn').value);
        this.result.datetimedepart = this.convertDateTime(this.qttFormOpenReturn.get('startDateOpenReturn').value, this.qttFormOpenReturn.get('startTimeOpenReturn').value);
        this.result.adults = this.qttFormOpenReturn.get('adultCountOpenReturn').value;
        this.result.Children = this.qttFormOpenReturn.get('childCountOpenReturn').value;
        let pathConstraintOpen = this.qttFormOpenReturn.get('pathConstraintTypeOpenReturn').value;
        if (pathConstraintOpen != "" && pathConstraintOpen != undefined) {
          this.result.PathConstraintLocation = this.findLocationCode(this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').value);
          this.result.PathConstraintType = this.qttFormOpenReturn.get('pathConstraintTypeOpenReturn').value;
          this.sharedService.isAmendFresh = false;
        }
        this.result.Traveltype = this.qttFormOpenReturn.get('travelTypeOpenReturn').value;
        this.result.IsReturnRequest = false;
        this.result.TravelSolutionDirection = 'OPEN_RETURN';
        let totalAdults=this.result.adults;
        let totalchildrens= this.result.Children;
        let hasRailcards=false;
        this.railcardsOpenReturn.controls.forEach(controls => {
          let railcardModel = new RailCardModel();
          if(controls.get('railCardCode').value!=""){
          railcardModel.Children = controls.get('railcardChild').value;
         // railcardModel.RailCard = controls.get('railcardName').value;
          railcardModel.numberofrailcards = controls.get('railcardCount').value;
          railcardModel.adults = controls.get('railcardAdult').value;
          railcardModel.RailCardCode=controls.get('railCardCode').value;
          hasRailcards=false;
          if (railcardModel.adults != 0 || railcardModel.Children != 0) {
            this.result.passengergroup.push(railcardModel);
          }
          totalAdults=totalAdults-railcardModel.adults;
              totalchildrens=totalchildrens-railcardModel.Children;
            }
        });

        if((!hasRailcards) &&(totalAdults>0 || totalchildrens>0)){
          let railcardModel = new RailCardModel();
          railcardModel.Children = totalchildrens;
          //railcardModel.RailCard = controls.get('railcardName').value;
          railcardModel.numberofrailcards = 0;
          railcardModel.adults = totalAdults;
          railcardModel.RailCardCode="";
          hasRailcards=true;
          if (railcardModel.adults != 0 || railcardModel.Children != 0) {
            this.result.passengergroup.push(railcardModel);
          
          }
        }
        //this.activeModal.close(this.result);
        
        this.dialogRef.close(this.result);
        
      }
    }
  }
  onLocationChanges(num,count){
    if (num == 1) {
      //Single form
      
      if (count == 11) {
        this.filteredDeparturesSingle = this.qttFormSingle.get("departureLocationNameSingle").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );
          this.singleDeploc=this.qttFormSingle.get('departureLocationNameSingle').value;

          this.qttFormReturn.patchValue({
            departureLocationNameReturn:this.singleDeploc
    
          });
    
          this.qttFormOpenReturn.patchValue({
            departureLocationNameOpenReturn:this.singleDeploc
    
          });
          
      }
      
      if (count == 12) {
        this.filteredArrivalsSingle = this.qttFormSingle.get("arrivalLocationNameSingle").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );

          this.singleArrLoc=this.qttFormSingle.get('arrivalLocationNameSingle').value;

          this.qttFormReturn.patchValue({
            arrivalLocationNameReturn:this.singleArrLoc
    
          });
    
          this.qttFormOpenReturn.patchValue({
            arrivalLocationNameOpenReturn:this.singleArrLoc
    
          });
      }

      if (count == 13) {
        this.filteredStationsSingle = this.qttFormSingle.get("pathConstraintLocationSingle").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );
      }
//debugger
      
    }

    if (num == 2) {
      //Return Form
      if (count == 21) {
        this.filteredDeparturesReturn = this.qttFormReturn.get("departureLocationNameReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );

          this.returnDepLoc=this.qttFormReturn.get('departureLocationNameReturn').value;

          this.qttFormSingle.patchValue({
            departureLocationNameSingle:this.returnDepLoc
    
          });
    
          this.qttFormOpenReturn.patchValue({
            departureLocationNameOpenReturn:this.returnDepLoc
    
          });
      }
      if (count == 22) {
        this.filteredArrivalsReturn = this.qttFormReturn.get("arrivalLocationNameReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );

          this.returnArrLoc=this.qttFormReturn.get('arrivalLocationNameReturn').value;

          this.qttFormSingle.patchValue({
            arrivalLocationNameSingle:this.returnArrLoc
    
          });
    
          this.qttFormOpenReturn.patchValue({
            arrivalLocationNameOpenReturn:this.returnArrLoc
    
          });
      }
      if (count == 23) {
        this.filteredStationsReturn = this.qttFormReturn.get("pathConstraintLocationReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );
      }

    }

    if (num == 3) {
      //Open Return Form
      if (count == 31) {
        this.filteredDeparturesOpenReturn = this.qttFormOpenReturn.get("departureLocationNameOpenReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );

          this.openDepLoc=this.qttFormOpenReturn.get('departureLocationNameOpenReturn').value;

          this.qttFormSingle.patchValue({
            departureLocationNameSingle:this.openDepLoc
    
          });
    
          this.qttFormReturn.patchValue({
            departureLocationNameReturn:this.openDepLoc
    
          });
      }
      if (count == 32) {
        this.filteredArrivalsOpenReturn = this.qttFormOpenReturn.get("arrivalLocationNameOpenReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );

          this.openArrLoc=this.qttFormReturn.get('arrivalLocationNameOpenReturn').value;

          this.qttFormSingle.patchValue({
            arrivalLocationNameSingle:this.openArrLoc
    
          });
    
          this.qttFormReturn.patchValue({
            arrivalLocationNameReturn:this.openArrLoc
    
          });
      }
      if (count == 33) {
        this.filteredStationsOpenReturn = this.qttFormOpenReturn.get("pathConstraintLocationOpenReturn").valueChanges
          .pipe(
            startWith(''),
            map(location => location.length >= 2 ? this._filterLocations(location) : [])
          );
      }

    }
  }
  selectedAdultsRailcard: number = 0;
  selectedChildsRailcard: number = 0;
  isAdultRailcardSelected: boolean = false;
  isChildRailcardSelected: boolean = false;
  

  // loadRailcards(){
  //   this.filteredCardNamesSingle = this.qttFormSingle.get("railsSingle").value();
  // }

  tempOpenReturn: any;
  prevAdultsOpenReturn: number;
  prevChildsOpenReturn: number;
  showRemoveOpenReturn: boolean = false;
  tempSingle: any;
  onRailcardActionChangeSingle(index) {

    //this.filteredCardNamesSingle = this.qttFormSingle.get("railsSingle").value();
         
    this.isRailcardSelectedSingle = true;
    let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
    //this.filteredCardNamesSingle=this.qttFormSingle.get('railcardsSingle').value();
    arrayControl.controls[index].get('railcardCount').enable();
    this.selectedAdultsRailcard = 0;
    this.selectedChildsRailcard = 0;
    this.isAdultRailcardSelected = false;
    this.isChildRailcardSelected = false;
    this.currentRailcardIndex = index;
    if (this.railcardsSingle.length >= 1) {
      this.showRemoveSingle = true;
    }
  }

  onRailcardActionChangeReturn(index) {
    this.isRailcardSelectedReturn = true;
    let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
    arrayControl.controls[index].get('railcardCount').enable();
    this.selectedAdultsRailcardReturn = 0;
    this.selectedChildsRailcardReturn = 0;
    this.isAdultRailcardSelectedReturn = false;
    this.isChildRailcardSelectedReturn = false;
    this.currentRailcardIndexReturn = index;
    if (this.railcardsReturn.length >= 1) {
      this.showRemoveReturn = true;
    }
  }
  onRailcardActionChangeOpenReturn(index) {
    this.isRailcardSelectedOpenReturn = true;
    let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    arrayControl.controls[index].get('railcardCount').enable();
    this.selectedAdultsRailcardOpenReturn = 0;
    this.selectedChildsRailcardOpenReturn = 0;
    this.isAdultRailcardSelectedOpenReturn = false;
    this.isChildRailcardSelectedOpenReturn = false;
    this.currentRailcardIndexOpenReturn = index;
    if (this.railcardsOpenReturn.length >= 1) {
      this.showRemoveOpenReturn = true;
    }
  }

  public counter:any=0;
  public counterReturn:any=0;
  public counterOpenReturn:any=0;

  onRailcardCountChangeSingle(index, event) {
    this.railcardCompleted = false;
    let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
    arrayControl.controls[index].get('railcardAdult').enable();
    arrayControl.controls[index].get('railcardChild').enable();
    let currentRailcardCount = event.value;
    let selectedRailcardName = arrayControl.controls[index].get('railCardCode').value;
    this.adultForRailcardCount = this.getRemainingAdults(index, 1);
    this.childForRailcardCount = this.getRemainingChilds(index, 1);
    if (!this.isRailcardCountSelectedSingle) {
      this.isRailcardCountSelectedSingle = true;
      this.tempSingle = event.value;
      this.prevAdults = this.adultForRailcardCount;
      this.prevChilds = this.childForRailcardCount;
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsSingle, this.adultForRailcardCount, this.childForRailcardCount, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    else {
      this.numOfRailcardsSingle -= this.tempSingle;
      this.tempSingle = event.value
      if (this.isAdultRailcardSelected) {
        arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcard, this.adultForRailcardCount, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelected) {
        arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcard, this.childForRailcardCount, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
      }
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsSingle, this.adultForRailcardCount, this.childForRailcardCount, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    this.numOfRailcardsSingle += event.value;

    if (this.qttFormSingle.get(['railcardsSingle', index, 'railcardCount']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardAdult']).errors == null
      && this.qttFormSingle.get(['railcardsSingle', index, 'railcardChild']).errors == null) {
      this.railcardCompleted = true;
    }
    this.expendedSearchRequest.railcardscount++;
    this.counter=this.expendedSearchRequest.railcardscount;

    this.hideShowAddMoreButton(1);
  }

  onRailcardCountChangeReturn(index, event) {
    this.railcardCompletedReturn = false;
    let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
    arrayControl.controls[index].get('railcardAdult').enable();
    arrayControl.controls[index].get('railcardChild').enable();
    let currentRailcardCount = event.value;
    let selectedRailcardName = arrayControl.controls[index].get('railCardCode').value;
    this.adultForRailcardCountReturn = this.getRemainingAdults(index, 2);
    this.childForRailcardCountReturn = this.getRemainingChilds(index, 2);
    if (!this.isRailcardCountSelectedReturn) {
      this.isRailcardCountSelectedReturn = true;
      this.tempReturn = event.value;
      this.prevAdultsReturn = this.adultForRailcardCountReturn;
      this.prevChildsReturn = this.childForRailcardCountReturn;
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsReturn, this.adultForRailcardCountReturn, this.childForRailcardCountReturn, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    else {
      this.numOfRailcardsReturn -= this.tempReturn;
      this.tempReturn = event.value
      if (this.isAdultRailcardSelectedReturn) {
        arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardReturn, this.adultForRailcardCountReturn, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedReturn) {
        arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardReturn, this.childForRailcardCountReturn, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
      }
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsReturn, this.adultForRailcardCountReturn, this.childForRailcardCountReturn, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    this.numOfRailcardsReturn += event.value;

    if (this.qttFormReturn.get(['railcardsReturn', index, 'railcardCount']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardAdult']).errors == null
      && this.qttFormReturn.get(['railcardsReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedReturn = true;
    }

    this.expendedSearchRequest.railcardscountReturn++;
    this.counterReturn=this.expendedSearchRequest.railcardscountReturn;

    this.hideShowAddMoreButton(2);
  }

  onRailcardCountChangeOpenReturn(index, event) {
    this.railcardCompletedOpenReturn = false;
    let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    arrayControl.controls[index].get('railcardAdult').enable();
    arrayControl.controls[index].get('railcardChild').enable();
    let currentRailcardCount = event.value;
    let selectedRailcardName = arrayControl.controls[index].get('railCardCode').value;
    this.adultForRailcardCountOpenReturn = this.getRemainingAdults(index, 3);
    this.childForRailcardCountOpenReturn = this.getRemainingChilds(index, 3);
    if (!this.isRailcardCountSelectedOpenReturn) {
      this.isRailcardCountSelectedOpenReturn = true;
      this.tempOpenReturn = event.value;
      this.prevAdultsOpenReturn = this.adultForRailcardCountOpenReturn;
      this.prevChildsOpenReturn = this.childForRailcardCountOpenReturn;
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsOpenReturn, this.adultForRailcardCountOpenReturn, this.childForRailcardCountOpenReturn, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    else {
      this.numOfRailcardsOpenReturn -= this.tempOpenReturn;
      this.tempOpenReturn = event.value
      if (this.isAdultRailcardSelectedOpenReturn) {
        arrayControl.controls[index].get('railcardAdult').setValidators([adultValidator(this.selectedAdultsRailcardOpenReturn, this.adultForRailcardCountOpenReturn, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardAdult').updateValueAndValidity();
      }
      if (this.isChildRailcardSelectedOpenReturn) {
        arrayControl.controls[index].get('railcardChild').setValidators([childValidator(this.selectedChildsRailcardOpenReturn, this.childForRailcardCountOpenReturn, selectedRailcardName, currentRailcardCount)]);
        arrayControl.controls[index].get('railcardChild').updateValueAndValidity();
      }
      arrayControl.controls[index].get('railcardCount').setValidators([railcardPerPassengerValidator(this.numOfRailcardsOpenReturn, this.adultForRailcardCountOpenReturn, this.childForRailcardCountOpenReturn, selectedRailcardName, currentRailcardCount)]);
      arrayControl.controls[index].get('railcardCount').updateValueAndValidity();
    }
    this.numOfRailcardsOpenReturn += event.value;

    if (this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardCount']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardAdult']).errors == null
      && this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardChild']).errors == null) {
      this.railcardCompletedOpenReturn = true;
    }

    this.expendedSearchRequest.railcardscountOpenreturn++;
    this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;

    this.hideShowAddMoreButton(3);
  }

  selectedAdultsRailcardReturn: number = 0;
  selectedChildsRailcardReturn: number = 0;
  isAdultRailcardSelectedReturn: boolean = false;
  isChildRailcardSelectedReturn: boolean = false;
  currentAdultRailcard: number = 0;
  currentChildRailcard: number = 0;
  adultsForRailcardAdultReturn: number = 0;
  childForRailcardChildReturn: number = 0;
  remainingAdult: number;
  remainingChild: number;
  railcardCompletedReturn: boolean = false;
  currentRailcardIndexReturn: number = 0;
  isRailcardsCountErrorFree: boolean = false;
  isRailcardsAdultErrorFree: boolean = false;
  isRailcardsChildErrorFree: boolean = false;
  isRailcardsCountErrorFreeReturn: boolean = false;
  isRailcardsAdultErrorFreeReturn: boolean = false;
  isRailcardsChildErrorFreeReturn: boolean = false;
  isRailcardsCountErrorFreeOpenReturn: boolean = false;
  isRailcardsAdultErrorFreeOpenReturn: boolean = false;
  isRailcardsChildErrorFreeOpenReturn: boolean = false;
  isRailcardSelectedOpenReturn: boolean = false;
  isRailcardCountSelectedOpenReturn: boolean = false;
  numOfRailcardsOpenReturn: number = 0;
  showGroupTravelLinkReturn: boolean = false;
  showGroupTravelLinkOpenReturn: boolean = false;
  selectedAdultsRailcardOpenReturn: number = 0;
  selectedChildsRailcardOpenReturn: number = 0;ializeforms
  adultsForRailcardAdultOpenReturn: number = 0;
  childForRailcardChildOpenReturn: number = 0;
  railcardCompletedOpenReturn: boolean = false;
  currentRailcardIndexOpenReturn: number = 0;
  


  initializeFormData(){
    this.initializeForms();
  }

  initializeForms(){
//debugger
    this.qttFormOpenReturn.patchValue({
      departureLocationNameOpenReturn: this.findLocation(this.expendedSearchRequest.locfrom),
      arrivalLocationNameOpenReturn: this.findLocation(this.expendedSearchRequest.locto),
      pathConstraintTypeOpenReturn: this.expendedSearchRequest.PathConstraintType,
      pathConstraintLocationOpenReturn: this.findLocation(this.expendedSearchRequest.PathConstraintLocation),
      travelTypeOpenReturn: this.expendedSearchRequest.Traveltype,
      startTimeOpenReturn: this.prepopulatedTime,
      startDateOpenReturn: this.prepopulatedDate,
      adultCountOpenReturn: this.expendedSearchRequest.adults,
      childCountOpenReturn: this.expendedSearchRequest.Children
    });

    if (this.expendedSearchRequest.railcardscountOpenreturn >0) 
        {
          this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;
        }

    //Railcard for Open Return Initialize
    let arrayControlOpenReturn = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
    if (this.expendedSearchRequest.passengergroup.length != 0) {
      arrayControlOpenReturn.clear();
      this.expendedSearchRequest.passengergroup.forEach(railcard => {
        arrayControlOpenReturn.push(this.formbuilder.group({
          railCardCode: railcard.RailCardCode,
          railcardCount: railcard.numberofrailcards,
          railcardAdult: railcard.adults,
          railcardChild: railcard.Children
        }))
      });
      if (this.railcardsOpenReturn.length >= 1) {
        this.showRemoveOpenReturn = true;
        this.isRailcardSelectedOpenReturn = true;
        this.isAdultRailcardSelectedOpenReturn = true;
        this.isChildRailcardSelectedOpenReturn = true;
        this.isRailcardCountSelectedOpenReturn = true;
        this.railcardCompletedOpenReturn = true;    
        this.currentRailcardIndexOpenReturn = this.expendedSearchRequest.passengergroup.length - 1;
        this.selectedAdultsRailcardOpenReturn = this.expendedSearchRequest.passengergroup[this.currentRailcardIndexOpenReturn].adults;
        this.selectedChildsRailcardOpenReturn = this.expendedSearchRequest.passengergroup[this.currentRailcardIndexOpenReturn].Children;
        this.hideShowAddMoreButton(3); 
      }
    }
debugger
    this.qttFormReturn.patchValue({
      departureLocationNameReturn: this.findLocation(this.expendedSearchRequest.locfrom),
      arrivalLocationNameReturn: this.findLocation(this.expendedSearchRequest.locto),
      pathConstraintTypeReturn: this.expendedSearchRequest.PathConstraintType,
      pathConstraintLocationReturn: this.findLocation(this.expendedSearchRequest.PathConstraintLocation),
      travelTypeReturn: this.expendedSearchRequest.Traveltype,
      startTimeReturn: this.prepopulatedTime,
      startDateReturn: this.prepopulatedDate,
      adultCountReturn: this.expendedSearchRequest.adults,
      childCountReturn: this.expendedSearchRequest.Children,
      returnDateReturn: this.prepopulatedDateReturn == "Invalid date" ? null : this.prepopulatedDateReturn,
      returnTravelTypeReturn: this.expendedSearchRequest.TraveltypeReturn,
      returnTimeReturn: this.prepopulatedTimeReturn,
    });

    if (this.expendedSearchRequest.railcardscountReturn >0) 
        {
          this.counterReturn=this.expendedSearchRequest.railcardscountReturn;
        }

    //Railcard for Return Initialize
    let arrayControlReturn = this.qttFormReturn.get('railcardsReturn') as FormArray;
    if (this.expendedSearchRequest.passengergroup.length != 0) {
      arrayControlReturn.clear();
      this.expendedSearchRequest.passengergroup.forEach(railcard => {
        arrayControlReturn.push(this.formbuilder.group({
          railCardCode: railcard.RailCardCode,
          railcardCount: railcard.numberofrailcards,
          railcardAdult: railcard.adults,
          railcardChild: railcard.Children
        }))
      });
      if (this.railcardsReturn.length >= 1) {
        this.showRemoveReturn = true;
        this.isRailcardSelectedReturn = true;
        this.isAdultRailcardSelectedReturn = true;
        this.isChildRailcardSelectedReturn = true;
        this.isRailcardCountSelectedReturn = true;
        this.railcardCompletedReturn = true;    
        this.currentRailcardIndexReturn = this.expendedSearchRequest.passengergroup.length - 1;
        this.selectedAdultsRailcardReturn = this.expendedSearchRequest.passengergroup[this.currentRailcardIndexReturn].adults;
        this.selectedChildsRailcardReturn = this.expendedSearchRequest.passengergroup[this.currentRailcardIndexReturn].Children;
        this.hideShowAddMoreButton(2); 
      }
    }

    debugger
    this.qttFormSingle.patchValue({
      departureLocationNameSingle: this.findLocation(this.expendedSearchRequest.locfrom),
      arrivalLocationNameSingle: this.findLocation(this.expendedSearchRequest.locto),
      pathConstraintTypeSingle: this.expendedSearchRequest.PathConstraintType,
      pathConstraintLocationSingle: this.findLocation(this.expendedSearchRequest.PathConstraintLocation),
      //railsSingle:this.findCards(this.expendedSearchRequest.railcardNames),

      startTimeSingle: this.prepopulatedTime,
      adultCountSingle: this.expendedSearchRequest.adults,
        childCountSingle: this.expendedSearchRequest.Children,
        travelTypeSingle: this.expendedSearchRequest.Traveltype,
        startDateSingle: this.prepopulatedDate,
       //railcardsSingle: this.expendedSearchRequest.passengergroup
    });

    if (this.expendedSearchRequest.railcardscount >0) 
        {
          this.counter=this.expendedSearchRequest.railcardscount;
        }

    //Railcard for Single initialize
    let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
    if (this.expendedSearchRequest.passengergroup.length != 0) {
      arrayControl.clear();
      this.expendedSearchRequest.passengergroup.forEach(railcard => {
        arrayControl.push(this.formbuilder.group({
          railCardCode: railcard.RailCardCode,
          railcardCount: railcard.numberofrailcards,
          railcardAdult: railcard.adults,
          railcardChild: railcard.Children
        }))
      });
      if (this.railcardsSingle.length >= 1) {
        this.showRemoveSingle = true;
        this.isRailcardSelectedSingle = true;
        this.isAdultRailcardSelected = true;
        this.isChildRailcardSelected = true;
        this.isRailcardCountSelectedSingle = true;
        this.railcardCompleted = true;    
        this.currentRailcardIndex = this.expendedSearchRequest.passengergroup.length - 1;
        this.selectedAdultsRailcard = this.expendedSearchRequest.passengergroup[this.currentRailcardIndex].adults;
        this.selectedChildsRailcard = this.expendedSearchRequest.passengergroup[this.currentRailcardIndex].Children; 
        this.hideShowAddMoreButton(1);         
      }
    
    }
  }

  private _filterLocations(value: string): LocationResponseData[] {
    debugger
    const filterValue = value.toLowerCase();
    return this.locations.filter(location => location.description.toLowerCase().includes(filterValue));
  }

  findLocationCode(value) {
    debugger
    if (value !== null && value !== '' && value !== undefined && value !== 0) {
      let station = this.locations.filter(m => m.description == value);
    
      return station[0].nlc;
      
    }
    else {
      return 0;
    }
  }

  findLocation(value) {
    if (value !== null && value !== '' && value !== undefined && value !== 0) {
      let station = this.locations.filter(m => m.nlc == value);
      return station[0].description;
    }
    else {
      return '';
    }
  }

  // findCards(value){
  //   if (value !== null && value !== '' && value !== undefined && value !== 0) {
  //     let cards = this.railcards.filter(m => m.RailCardCode == value);
  //     return cards[0].RailCard;
  //   }
  //   else {
  //     return '';
  //   }
  // }
 

  onPathConstraintChange(event, num) {
    if (num == 1) {
      if (event.value != "") {
        //this.qttFormSingle.get('pathConstraintLocationSingle').setValidators([Validators.required]);
        this.qttFormSingle.get('pathConstraintLocationSingle').updateValueAndValidity();
        //this.isTypeselectedSingle = false;
        this.qttFormSingle.get('pathConstraintLocationSingle').enable();
      }
      else {
        this.qttFormSingle.get('pathConstraintLocationSingle').setValidators(null);
        this.qttFormSingle.get('pathConstraintLocationSingle').setErrors(null);
        //this.isTypeselectedSingle = true;
        this.qttFormSingle.get('pathConstraintLocationSingle').setValue('');
        this.qttFormSingle.get('pathConstraintLocationSingle').disable();
      }
    }

    if (num == 2) {
      if (event.value != "") {
       // this.qttFormReturn.get('pathConstraintLocationReturn').setValidators([Validators.required]);
        this.qttFormReturn.get('pathConstraintLocationReturn').updateValueAndValidity();
        this.qttFormReturn.get('pathConstraintLocationReturn').enable();
      }
      else {
        this.qttFormReturn.get('pathConstraintLocationReturn').setValidators(null);
        this.qttFormReturn.get('pathConstraintLocationReturn').setErrors(null);
        this.qttFormReturn.get('pathConstraintLocationReturn').setValue('');
        this.qttFormReturn.get('pathConstraintLocationReturn').disable();
      }
    }

    if (num == 3) {
      if (event.value != "") {
        //this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').setValidators([Validators.required]);
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').updateValueAndValidity();
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').enable();
      }
      else {
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').setValidators(null);
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').setErrors(null);
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').setValue('');
        this.qttFormOpenReturn.get('pathConstraintLocationOpenReturn').disable();
      }
    }
  }

  singleDate:any;
  singleTime:any;
  singleDeploc:any;
  singleArrLoc:any;

   onDateChangeSingle(event) {
     debugger
    this.qttFormSingle.get('startTimeSingle').setValidators([Validators.required, pastTimeValidator(event.target.value)]);
    this.qttFormSingle.get('startTimeSingle').updateValueAndValidity();

    this.singleDate =this.qttFormSingle.get('startDateSingle').value;
    //this.qttFormOpenReturn.controls('startTimeOpenReturn').setValue(this.singleTime);
    this.qttFormOpenReturn.patchValue({
      startDateOpenReturn:this.singleDate

    });

    this.qttFormReturn.patchValue({
      startDateReturn:this.singleDate
    });
   }

   returnDate:any;
   returnTime:any;
   returnDepLoc:any;
   returnArrLoc:any;

   onDateChangeReturn(event) {
    this.qttFormReturn.get('startTimeReturn').setValidators([Validators.required, pastTimeValidator(event.target.value)]);
    this.qttFormReturn.get('startTimeReturn').updateValueAndValidity();
    this.qttFormReturn.get('returnTimeReturn').setValidators([Validators.required, pastTimeValidator(this.qttFormReturn.get('returnDateReturn').value), returnTimeValidator(this.qttFormReturn.get('returnDateReturn').value, event.target.value, this.qttFormReturn.get('startTimeReturn').value)]);
    this.qttFormReturn.get('returnTimeReturn').updateValueAndValidity();

    this.returnDate =this.qttFormReturn.get('startDateReturn').value;
    //this.qttFormOpenReturn.controls('startTimeOpenReturn').setValue(this.singleTime);
    this.qttFormOpenReturn.patchValue({
      startDateOpenReturn:this.returnDate
    });

    this.qttFormSingle.patchValue({
      startDateSingle:this.returnDate
    });
  }

  onReturnDateChangeReturn(event) {
    this.qttFormReturn.get('returnTimeReturn').setValidators([Validators.required, pastTimeValidator(event.target.value), returnTimeValidator(event.target.value, this.qttFormReturn.get('startDateReturn').value, this.qttFormReturn.get('startTimeReturn').value)]);
    this.qttFormReturn.get('returnTimeReturn').updateValueAndValidity();
  }

  onStartTimeReturnChange(event) {
    this.qttFormReturn.get('returnTimeReturn').setValidators([Validators.required, pastTimeValidator(this.qttFormReturn.get('returnDateReturn').value), returnTimeValidator(this.qttFormReturn.get('returnDateReturn').value, this.qttFormReturn.get('startDateReturn').value, event.value)]);
    this.qttFormReturn.get('returnTimeReturn').updateValueAndValidity();

    this.returnTime=this.qttFormReturn.get('startTimeReturn').value;

     this.qttFormSingle.patchValue({
       startTimeReturn:this.returnTime
     });

     this.qttFormOpenReturn.patchValue({
      startTimeOpenReturn:this.returnTime
    });
  }
  

  isRailcardSelectedReturn: boolean = false;
  isRailcardCountSelectedReturn: boolean = false;
  numOfRailcardsReturn: number = 0;
  
   isShowAddMoreButton: boolean = false;
   isShowAddMoreButtonReturn: boolean = false;
   isShowAddMoreButtonOpenReturn: boolean = false;
   isShowAddMoreButtonSeason: boolean = false;
   

   setSearchRequestRailcards(num) {
    this.expendedSearchRequest.passengergroup = new Array<RailCardModel>();
    let formName;
    if (num == 1) {
      formName = this.railcardsSingle;
    }
     else if (num == 2) {
       formName = this.railcardsReturn;
     }
     else if (num == 3) {
       formName = this.railcardsOpenReturn;
     }
    // else if (num == 4) {
    //   formName = this.railcardsSeason;
    // }
    formName.controls.forEach(controls => {
      let railcardModel = new RailCardModel();
      railcardModel.Children = controls.get('railcardChild').value;
      //railcardModel.RailCard = controls.get('railcardName').value;
      railcardModel.numberofrailcards = controls.get('railcardCount').value;
      railcardModel.adults = controls.get('railcardAdult').value;
      railcardModel.RailCardCode=controls.get('railCardCode').value;
      this.expendedSearchRequest.passengergroup.push(railcardModel);
    });
  }

   hideShowAddMoreButton(num) {
     if (num == 1) {
       this.setSearchRequestRailcards(num);
       if (this.expendedSearchRequest.passengergroup.length > 0) {
         let totalAdults = 0;
         let totalChilds = 0;
         this.expendedSearchRequest.passengergroup.forEach(m => {
           totalAdults = totalAdults + m.adults;
           totalChilds = totalChilds + m.Children;
         });
         if (this.adultSingle > totalAdults || this.childSingle > totalChilds) {
           this.isShowAddMoreButton = true;
         }
         else {
           this.isShowAddMoreButton = false;
         }
       }
     }
      if (num == 2) {
        this.setSearchRequestRailcards(num);
        if (this.expendedSearchRequest.passengergroup.length > 0) {
          let totalAdults = 0;
          let totalChilds = 0;
          this.expendedSearchRequest.passengergroup.forEach(m => {
            totalAdults = totalAdults + m.adults;
            totalChilds = totalChilds + m.Children;
          });
          if (this.adultReturn > totalAdults || this.childReturn > totalChilds) {
            this.isShowAddMoreButtonReturn = true;
          }
          else {
            this.isShowAddMoreButtonReturn = false;
          }
        }
      }
      if (num == 3) {
        this.setSearchRequestRailcards(num);
        if (this.expendedSearchRequest.passengergroup.length > 0) {
          let totalAdults = 0;
          let totalChilds = 0;
          this.expendedSearchRequest.passengergroup.forEach(m => {
            totalAdults = totalAdults + m.adults;
            totalChilds = totalChilds + m.Children;
          });
          if (this.adultOpenReturn > totalAdults || this.childOpenReturn > totalChilds) {
            this.isShowAddMoreButtonOpenReturn = true;
          }
          else {
            this.isShowAddMoreButtonOpenReturn = false;
          }
        }
      }
    // //  if (num == 4) {
    // //    this.setSearchRequestRailcards(num);
    // //    if (this.amendSearchRequest.RailCardList.length > 0) {
    //      let totalAdults = 0;
    //      let totalChilds = 0;
    //      this.amendSearchRequest.RailCardList.forEach(m => {
    //        totalAdults = totalAdults + m.Adult;
    //        totalChilds = totalChilds + m.Child;
    //      });
    //      if (this.adultSeason > totalAdults || this.childSeason > totalChilds) {
    //        this.isShowAddMoreButtonSeason = true;
    //      }
    //      else {
    //        this.isShowAddMoreButtonSeason = false;
    //      }
    //    }
    //  }
   }
   removeRailcardSingle(index) {
    let railcardToRemove = this.qttFormSingle.get(['railcardsSingle', index, 'railcardCount']).value;
    let railcardAdultToRemove = this.qttFormSingle.get(['railcardsSingle', index, 'railcardAdult']).value;
    let railcardChildToRemove = this.qttFormSingle.get(['railcardsSingle', index, 'railcardChild']).value;
    if (this.railcardsSingle.length > 1) {
      this.numOfRailcardsSingle -= railcardToRemove;
      this.adultForRailcardCount += railcardAdultToRemove;
      this.adultsForRailcardAdult += railcardAdultToRemove;
      this.childForRailcardCount += railcardChildToRemove;
      this.childForRailcardChild += railcardChildToRemove;
      this.railcardsSingle.removeAt(index);      
    }
    else {
      this.numOfRailcardsSingle -= railcardToRemove;
      this.adultForRailcardCount += railcardAdultToRemove;
      this.adultsForRailcardAdult += railcardAdultToRemove;
      this.childForRailcardCount += railcardChildToRemove;
      this.childForRailcardChild += railcardChildToRemove;
      this.qttFormSingle.controls.railcardsSingle['controls'][index].patchValue({
        railCardCode: '',
        railcardCount: 0,
        railcardAdult: 0,
        railcardChild: 0
      });
      let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
      arrayControl.controls[index].get('railcardCount').disable();
      arrayControl.controls[index].get('railcardAdult').disable();
      arrayControl.controls[index].get('railcardChild').disable();

      this.isRailcardSelectedSingle = false;
      this.isRailcardCountSelectedSingle = false;
      this.isAdultRailcardSelected = false;
      this.isChildRailcardSelected = false;
      this.isRailcardsCountErrorFree = false;
      this.isRailcardsAdultErrorFree = false;
      this.isRailcardsChildErrorFree = false;
      this.showRemoveSingle = false;
    }

    if(railcardToRemove==0 || railcardToRemove==null || railcardToRemove==undefined)
    {
      this.counter=this.expendedSearchRequest.railcardscount;
    }
    else{
    if (this.counter==1)
      {
        this.expendedSearchRequest.railcardscount=0;
      this.counter=this.expendedSearchRequest.railcardscount;
      }
      else
      {
        this.expendedSearchRequest.railcardscount--;
        if(this.expendedSearchRequest.railcardscount<0){
        this.expendedSearchRequest.railcardscount=0;
      }
      this.counter=this.expendedSearchRequest.railcardscount;
      }
    }

    this.hideShowAddMoreButton(1);
  }

  removeRailcardReturn(index) {
    let railcardToRemove = this.qttFormReturn.get(['railcardsReturn', index, 'railcardCount']).value;
    let railcardAdultToRemove = this.qttFormReturn.get(['railcardsReturn', index, 'railcardAdult']).value;
    let railcardChildToRemove = this.qttFormReturn.get(['railcardsReturn', index, 'railcardChild']).value;
    if (this.railcardsReturn.length > 1) {
      this.numOfRailcardsReturn -= railcardToRemove;
      this.adultForRailcardCountReturn += railcardAdultToRemove;
      this.adultsForRailcardAdultReturn += railcardAdultToRemove;
      this.childForRailcardCountReturn += railcardChildToRemove;
      this.childForRailcardChildReturn += railcardChildToRemove;
      this.railcardsReturn.removeAt(index);
    }
    else {
      this.numOfRailcardsReturn -= railcardToRemove;
      this.adultForRailcardCountReturn += railcardAdultToRemove;
      this.adultsForRailcardAdultReturn += railcardAdultToRemove;
      this.childForRailcardCountReturn += railcardChildToRemove;
      this.childForRailcardChildReturn += railcardChildToRemove;
      this.qttFormReturn.controls.railcardsReturn['controls'][index].patchValue({
        railCardCode: '',
        railcardCount: 0,
        railcardAdult: 0,
        railcardChild: 0
      });
      let arrayControl = this.qttFormReturn.get('railcardsReturn') as FormArray;
      arrayControl.controls[index].get('railcardCount').disable();
      arrayControl.controls[index].get('railcardAdult').disable();
      arrayControl.controls[index].get('railcardChild').disable();

      this.isRailcardSelectedReturn = false;
      this.isRailcardCountSelectedReturn = false;
      this.isAdultRailcardSelectedReturn = false;
      this.isChildRailcardSelectedReturn = false;
      this.isRailcardsCountErrorFreeReturn = false;
      this.isRailcardsAdultErrorFreeReturn = false;
      this.isRailcardsChildErrorFreeReturn = false;
      this.showRemoveReturn = false;
    }

    if(railcardToRemove==0 || railcardToRemove==null || railcardToRemove==undefined)
    {
      this.counterReturn=this.expendedSearchRequest.railcardscountReturn;
    }
    else{
    if (this.counterReturn==1)
      {
        this.expendedSearchRequest.railcardscountReturn=0;
      this.counterReturn=this.expendedSearchRequest.railcardscountReturn;
      }
      else
      {
        this.expendedSearchRequest.railcardscountReturn--;
        if(this.expendedSearchRequest.railcardscountReturn<0){
          this.expendedSearchRequest.railcardscountReturn=0;
        }
      this.counterReturn=this.expendedSearchRequest.railcardscountReturn;
      }
    }

    this.hideShowAddMoreButton(2);
  }

  removeRailcardOpenReturn(index) {
    let railcardToRemove = this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardCount']).value;
    let railcardAdultToRemove = this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardAdult']).value;
    let railcardChildToRemove = this.qttFormOpenReturn.get(['railcardsOpenReturn', index, 'railcardChild']).value;
    if (this.railcardsReturn.length > 1) {
      this.numOfRailcardsOpenReturn -= railcardToRemove;
      this.adultForRailcardCountOpenReturn += railcardAdultToRemove;
      this.adultsForRailcardAdultOpenReturn += railcardAdultToRemove;
      this.childForRailcardCountOpenReturn += railcardChildToRemove;
      this.childForRailcardChildOpenReturn += railcardChildToRemove;
      this.railcardsOpenReturn.removeAt(index);
    }
    else {
      this.numOfRailcardsOpenReturn -= railcardToRemove;
      this.adultForRailcardCountOpenReturn += railcardAdultToRemove;
      this.adultsForRailcardAdultOpenReturn += railcardAdultToRemove;
      this.childForRailcardCountOpenReturn += railcardChildToRemove;
      this.childForRailcardChildOpenReturn += railcardChildToRemove;
      this.qttFormOpenReturn.controls.railcardsOpenReturn['controls'][index].patchValue({
        railCardCode: '',
        railcardCount: 0,
        railcardAdult: 0,
        railcardChild: 0
      });
      let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
      arrayControl.controls[index].get('railcardCount').disable();
      arrayControl.controls[index].get('railcardAdult').disable();
      arrayControl.controls[index].get('railcardChild').disable();

      this.isRailcardSelectedOpenReturn = false;
      this.isRailcardCountSelectedOpenReturn = false;
      this.isAdultRailcardSelectedOpenReturn = false;
      this.isChildRailcardSelectedOpenReturn = false;
      this.isRailcardsCountErrorFreeOpenReturn = false;
      this.isRailcardsAdultErrorFreeOpenReturn = false;
      this.isRailcardsChildErrorFreeOpenReturn = false;
      this.showRemoveOpenReturn = false;
    }

    if(railcardToRemove==0 || railcardToRemove==null || railcardToRemove==undefined)
    {
      this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;
    }
    else{

    if (this.counterOpenReturn==1)
      {
        this.expendedSearchRequest.railcardscountOpenreturn=0;
      this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;
      }
      else
      {
        this.expendedSearchRequest.railcardscountOpenreturn--;
        if(this.expendedSearchRequest.railcardscountOpenreturn<0){
          this.expendedSearchRequest.railcardscountOpenreturn=0;
        }
      this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;
      }
    }

    this.hideShowAddMoreButton(3);
  }

  onCancel(num) {
    if (num == 1) {
      let arrayControl = this.qttFormSingle.get('railcardsSingle') as FormArray;
      arrayControl.clear();
      this.railcardsSingle.clear();
      this.railcardsSingle = this.qttFormSingle.get('railcardsSingle') as FormArray;
      this.railcardsSingle.push(this.createRailcardGroupSingle());
      this.isAdultRailcardSelected = false;
      this.isChildRailcardSelected = false;
      this.isRailcardSelectedSingle = false;
      this.isRailcardCountSelectedSingle = false;
      this.showRemoveSingle = false;

      this.expendedSearchRequest.railcardscount=0;
        if(this.expendedSearchRequest.railcardscount<0){
          this.expendedSearchRequest.railcardscount=0;
        }
      this.counter=this.expendedSearchRequest.railcardscount;
      
      
    }
    
    if (num == 2) {
       let arrayControl = this.qttFormReturn.get('railcardsSingle') as FormArray;
       arrayControl.clear();
       this.railcardsReturn.clear();
       this.railcardsReturn = this.qttFormReturn.get('railcardsSingle') as FormArray;
       this.railcardsReturn.push(this.createRailcardGroupReturn());
       this.isAdultRailcardSelectedReturn = false;
       this.isChildRailcardSelectedReturn = false;
       this.isRailcardSelectedReturn = false;
       this.isRailcardCountSelectedReturn = false;
       this.showRemoveReturn = false;

       this.expendedSearchRequest.railcardscountReturn=0;
        if(this.expendedSearchRequest.railcardscountReturn<0){
          this.expendedSearchRequest.railcardscountReturn=0;
        }
      this.counterReturn=this.expendedSearchRequest.railcardscountReturn;
      
     }
     if (num == 3) {
       let arrayControl = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
       arrayControl.clear();
       this.railcardsOpenReturn.clear();
       this.railcardsOpenReturn = this.qttFormOpenReturn.get('railcardsOpenReturn') as FormArray;
       this.railcardsOpenReturn.push(this.createRailcardGroupOpenReturn());
       this.isAdultRailcardSelectedOpenReturn = false;
       this.isChildRailcardSelectedOpenReturn = false;
       this.isRailcardSelectedOpenReturn = false;
       this.isRailcardCountSelectedOpenReturn = false;
       this.showRemoveOpenReturn = false;

       this.expendedSearchRequest.railcardscountOpenreturn=0;
        if(this.expendedSearchRequest.railcardscountOpenreturn<0){
          this.expendedSearchRequest.railcardscountOpenreturn=0;
        }
      this.counterOpenReturn=this.expendedSearchRequest.railcardscountOpenreturn;
    
     }
    // if (num == 4) {
    //   let arrayControl = this.qttFormSeason.get('railcardsSeason') as FormArray;
    //   arrayControl.clear();
    //   this.railcardsSeason.clear();
    //   this.railcardsSeason = this.qttFormSeason.get('railcardsSeason') as FormArray;
    //   this.railcardsSeason.push(this.createRailcardGroup());
    //   this.isAdultRailcardSelectedSeason = false;
    //   this.isChildRailcardSelectedSeason = false;
    //   this.isRailcardSelectedSeason = false;
    //   this.isRailcardCountSelectedSeason = false;
    //   this.showRemoveSeason = false;
    // }
  }

  onChangeStationsSearchReturn() {
    var departurLocation = this.qttFormReturn.get('departureLocationNameReturn').value;
    var arrivalLocation = this.qttFormReturn.get('arrivalLocationNameReturn').value;
    this.qttFormReturn.patchValue({
      departureLocationNameReturn: arrivalLocation,
      arrivalLocationNameReturn: departurLocation
    });
  }

  onChangeStationsSearchSingle() {
    //debugger
    var departurLocation = this.qttFormSingle.get('departureLocationNameSingle').value;
    var arrivalLocation = this.qttFormSingle.get('arrivalLocationNameSingle').value;
    this.qttFormSingle.patchValue({
      departureLocationNameSingle: arrivalLocation,
      arrivalLocationNameSingle: departurLocation
    });
  }

  onChangeStationsSearchOpenReturn() {
    var departurLocation = this.qttFormOpenReturn.get('departureLocationNameOpenReturn').value;
    var arrivalLocation = this.qttFormOpenReturn.get('arrivalLocationNameOpenReturn').value;
    this.qttFormOpenReturn.patchValue({
      departureLocationNameOpenReturn: arrivalLocation,
      arrivalLocationNameOpenReturn: departurLocation
    });
  }

  onClose() {
    console.log('ab');
    this.dialog.closeAll();
    
  }

  onTimeChange(num)
  {

    if(num==1){
     this.singleTime=this.qttFormSingle.get('startTimeSingle').value;

     this.qttFormReturn.patchValue({
       startTimeReturn:this.singleTime
     });

     this.qttFormOpenReturn.patchValue({
      startTimeOpenReturn:this.singleTime
    });
  }

  else{
    this.openTime=this.qttFormOpenReturn.get('startTimeOpenReturn').value;

     this.qttFormReturn.patchValue({
       startTimeReturn:this.openTime
     });

     this.qttFormSingle.patchValue({
      startTimeSingle:this.openTime
    });
  }

  }
singleType:any;
returnType:any;
OpenType:any;

  onTravelTypeChange(num)
  {
    debugger
    if(num==1)
    {
          this.singleType=this.qttFormSingle.get('travelTypeSingle').value;

          this.qttFormReturn.patchValue({
            travelTypeReturn:this.singleType
          });

          this.qttFormOpenReturn.patchValue({
            travelTypeOpenReturn:this.singleType
          });
    }


    else if(num==2)
    {
      this.returnType=this.qttFormReturn.get('travelTypeReturn').value;

      this.qttFormSingle.patchValue({
        travelTypeSingle:this.returnType
      });

      this.qttFormOpenReturn.patchValue({
        travelTypeOpenReturn:this.returnType
      });

    }

    else
    {
      this.OpenType=this.qttFormOpenReturn.get('travelTypeOpenReturn').value;

      this.qttFormSingle.patchValue({
        travelTypeSingle:this.OpenType
      });

      this.qttFormReturn.patchValue({
        travelTypeReturn:this.OpenType
      });

    }
  }
  
}