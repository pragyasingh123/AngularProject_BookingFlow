import { logging } from 'protractor';

export class JourneySearchResponse
{
     OutwardOpenPureReturnFare : JourneyResponse[];
     SingleOutward : JourneyResponse[];
     SingleReturn : JourneyResponse[];
     JourneyReturnTimeDetails : JourneyReturnTimeDetails[];
     JourneyFareBreakups : JourneyFareBreakups[];
}

debugger
export class JourneyFareBreakups
{
     fareBreakupId : number;
     adults : number;
     childern :number;
     perAdultFare : number;
     perChildFare :number;
     totalAdultFare :number;
     totalChildernFare :number;
     totalFare:  number;
     railcards: string;
}

export class JourneyReturnTimeDetails
{
    fareGroupId   : number;
    departureTime : Date;
    arrivalTime  :  Date;
    duration      : number;
    totalChanges  :number;
    serviceId     : number;
    fareBreakupId : number[];
    enquiryId : number;
    firstInDay : boolean;
    lastInDay : boolean;
    fromStation:string;
    toStation:string;
    journeyType:string;
    journeyDetail:string;
    isServiceDisrupted:boolean;
    isQuickest:boolean;
}

export class JourneyResponse {
    departureTime :  Date;
    arrivalTime: Date;
    duration:number;
    minimumFare:number;
    totalChanges : number;
    fromStation:string;
    toStation:string;
    journeyType:string;
    journeyDetail:string;
    isCheapest:boolean;
    isOpenReturn:boolean;
    isServiceDisrupted:boolean;
    isQuickest:boolean;
    uId : number;
    enquiryId : number;
    firstInDay : boolean;
    lastInDay : boolean;
    serviceId : number;
    journeyFareDetails:JourneyFareDetails[];

}

export class JourneyFareDetails
{
    fareGroupId : number;
    fare:number;
    ticketType:string;
    ticketDetails:string;
    nectarPoint:number;
    isUpgradeToFirstClass:boolean;
    upgradeToFirstClassAmount:string;
    nectarPointsToUpgradeFirstClass:string;
    isDiscountedFare:boolean;
    fareBreakupId : number[];
    // Railcard: string;
    // FarePerson: string;
}


