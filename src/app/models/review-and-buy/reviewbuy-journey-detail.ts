import { ApplicableSeatAttributes, PreferenceGroups } from '../customer/seating-preference-response';

export class ReviewbuyJourneyDetail {
    journeyList:JourneyInfo[];
    journeyExtras: JourneyExtras;
    totalCost: number;
    nectarPointsEarned: number;
    // Fare:number;
    // journeyType:string;
    // changes:number;
    // DepartureTime:Date;
    // ArrivalTime:Date;
    // TicketType:string;
    // JourneyDepartureTime:Date;
    // JOurneyArrivalTime:Date;
    // DepartureStation:string;
    // ArrivalStation:string;
    // Duration:number;
}
export class JourneyInfo{
    tripNo:number;
    origin:string;
    destination:string;
    tickteList:TicketInfo[];
    totalJourneyCost:number;
    noOfAdults:number;
    noOfChildren:number;
    seatAttributes : ApplicableSeatAttributes;


    SeatPreferences : PreferenceGroups;
    JourneyTypeList : string[];
    IsBicycleReservationChecked : boolean;
    IsOutwardReservationMandatory : boolean;
    IsReturnReservationMandatory : boolean;
    MaxBicycleToBeReserved : Array<number>[];
}
export class TicketInfo{
    arrivalTime:string;
    departureTime:string;
    duration:number;
    isReservationMandatory: string;
    journeyDirection:string;
    noOfChanges:number;
    routeDescription:string;
    ticketCost:number;
    ticketRestrictionInfo:string;
    ticketType:string;
}
export class JourneyExtras{

}


export class RemoveJourneyRequest
{
    tripNo:number;
   
  
}

export class ReviewBuyResponse {
    //ReviewBuyCache:string;
    BasketCount:number;
  
  }