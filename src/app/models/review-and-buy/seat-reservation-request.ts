export class SeatReservationRequest
{
  sessionid: string;
  tripNo: string;
  reserveOutward: number;
  reserveInward: number;
  numberOfBicycles: number;
  numberOfWheelChairs: number;
  bicycleReservationsOnly: number;
  seatPreferences: string[];
}