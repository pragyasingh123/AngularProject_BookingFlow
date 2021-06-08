import { JourneyFareBreakups } from './search-services-response';

export class FareBreakupModel {
    OutWardJourney: FareModel[];
  }
export class FareModel
{
    JourneyFareType: string;
    JourneyFareTypeDup1:string;
    JourneyFareTypeDup2:string;
    FareBreakup: JourneyFareBreakups;
    Passenger: number;
  RailCard: string;
}