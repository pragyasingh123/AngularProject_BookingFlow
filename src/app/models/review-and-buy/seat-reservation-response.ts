export class SeatReservationResponse
{
    tripNo : number;
    seatPlaces : SeatReservedPlace[];
}

export class SeatReservedPlace
{
    coach : string;
    gender : string;
    placeid : string;
    preferenceCode : PreferenceCodes[];
    preferenceString : string;
}

export class PreferenceCodes
{
    prefCode : string;
    prefValue : string;
}