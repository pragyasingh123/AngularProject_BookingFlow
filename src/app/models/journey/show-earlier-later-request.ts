export class ShowEarlierShowLaterRequest
{
    direction : string;
    journeydirection : string;
    extendtimetable : number;
    sessionid : string;
}

export class ManagePageIndex
{
    startServiceTimeOutwardReturnOpenReturn=null;
    endServiceTimeOutwardReturnOpenReturn=null;
    startServiceTimeSingleOutward=null;
    endServiceTimeSingleOutward=null;
    startServiceTimeSingleReturn=null;
    endServiceTimeSingleReturn=null;
}