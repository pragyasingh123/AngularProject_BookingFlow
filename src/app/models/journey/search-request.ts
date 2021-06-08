import { RailCardModel } from './railcard.model';

export class SearchRequestModel {
    locfrom: any;
    locto: any;
    PathConstraintType:string;
    PathConstraintLocation:any;
    DepartureLocationName: String;
    ArrivalLocationName: String;
    openreturn: string;
    isseasonticket: string;
    oneway: string;
    outwarddepartafter: string;
    datetimedepart: string;
    showservices: string;
    enquiryMethod: string;
    firstclass: string;
    directServicesOnly: string;
    standardClass: string;
    returndepartafter: string;
    datetimereturn: string;
    passengergroup: RailCardModel[];
    adults:number;
    Children :number;
    Traveltype:string;
    DepartureTimesStart: string;
    //RailCardList: RailCardModel[];
    railcardNames:string;
    ReturnTimesStart: string;
    IsReturnRequest:boolean;
    TraveltypeReturn: string;
    TravelSolutionDirection: string;
    sessionid : string;
    railcardscount:any;
    railcardscountReturn:any;
    railcardscountOpenreturn:any;
}
