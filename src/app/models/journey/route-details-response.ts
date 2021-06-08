export class RouteDetailsResponse {
    isServiceDisrupted : boolean;
    tocDesc : string;
    sClass: string;
    errordetails : ErrorDetails[];
    reservation: string;
    buffetcar: boolean;
    showWiFi: boolean;
    trolley: boolean;
    callingPoints : CallPoints[];
  }

export class ErrorDetails{
  errorcode: string;
  errordesc : string;
}

export class CallPoints {
    station: string;
    arrivalDateTime:string;
    departureDateTime:string;
    showCallingPoints : boolean;
  }