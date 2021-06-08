import { Component, OnInit } from '@angular/core';
import { SharedService } from '../Services/shared.service';
import { FareBreakupModel, FareModel } from '../models/journey/fare-model';

@Component({
  selector: 'app-fare-breakup',
  templateUrl: './fare-breakup.component.html',
  styleUrls: ['./fare-breakup.component.css']
})

export class FareBreakupComponent implements OnInit {
  fareBreakupModelData: FareBreakupModel[];
  constructor(public sharedService: SharedService) {
    this.fareBreakupModelData = new Array<FareBreakupModel>();
   }

   totalFare: number;
  ngOnInit() {
    this.getFareBreakupData();
  }

  getFareBreakupData(){
    
    
    this.fareBreakupModelData = this.sharedService.fareBreakupModelData;
    // this.sharedService.setSharedCache();
    this.totalFare = 0;
     this.sharedService.fareBreakupModelData.forEach(obj=>{
      obj.OutWardJourney.forEach(objout=>{
         this.totalFare += objout.FareBreakup.totalFare;
       });
     });

    // this.sharedService.fareBreakupModelData[0].OutWardJourney.forEach(obj => {
    //   var outJourney = new FareModel;
    //   outJourney.Passenger = obj.FareBreakup.adults;//'1 * Adult';
    //   //outJourney.PricePerPerson = obj.BasePrice;
    //   this.totalFare = obj.FareBreakup.totalFare;
    //   outJourney.RailCard = obj.FareBreakup.railcards;
    //   //outJourney.IsCheck = obj.IsCheck;
    //   this.sharedService.fareBreakupModelData[0].OutWardJourney.push(outJourney);
    // });
      
  
    
  }
}
