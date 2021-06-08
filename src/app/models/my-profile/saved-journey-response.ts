import { RhResponse } from 'src/app/models/common/response';

export class GetSavedJourneys {
rhresponse:RhResponse;
savedjourney:SavedJourney[];
}

export class SavedJourney{
    id:Number;
    createddate:string;
    expirtydate:string;
    trip:Trip[];

}
export class Trip{
    destination:string;
    origin:string;
    outwarddatetime:string;
    returndatetime:string;
    totalcost:string;
    totalsavingsmade:string;
}