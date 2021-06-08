import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApireferenceService {

  locationList: string = 'api/Rail/locations';
  journeyDetail: string='api/Rail/journeydetail';
  routedetail : string = 'api/Rail/Routes2';
  journeyextend : string = 'api/Rail/journeyextend2';
  railCardLists: string = 'api/Rail/railcards';
  createReservation: string = 'Reservation/CreateReservation';
  customerLogin: string = 'api/Customer/logon';
  customerDetail: string = 'api/Customer/customer';
  ressetPasswordCustomer: string='Customer/GenerateNewPasswordByToken';
  ressetPasswordEmailLinkCustomer: string='api/Customer/sendresetpasswordemail';
  registerCustomer: string = 'api/Customer/customer';
  evaluateJourneyDetails : string = 'api/Customer/basket';
  journeySaved : string = 'api/Customer/SavedJourney';
  nectarcard : string = 'api/Customer/LoyaltyCard';
  UserSeatPreferences : string = 'api/Customer/seatpreferences';
  getSavedJourneys : string = 'api/Customer/SavedJourney';
  changePassword :string='api/Customer/changepassword';
  addressModification:string='api/Customer/address';
  getDeliveryModeData: string = 'DeliveryMode/GetDeliveryMode';
  saveDeliveryModeData: string = 'DeliveryMode/SaveDeliveryMode';
  CustomerDeliveryModeDetails: string = 'api/Customer/deliveryoptions';
  RailDeliveryModeDetailsRail: string = 'api/Rail/deliveryoptions';
  deleteUserAddress:string='api/Customer/deleteaddress';
  makeSeatReservation: string = 'api/Customer/Reservation';
  removeJourney: string = 'api/Customer/basket';
  getReservationConditions : string = 'api/Customer/Reservation';
  getReviewAndBuyDetails : string = 'api/Customer/GetReviewAndBuyDetails';
  forgetResetPassword : string = 'api/Customer/resetpassword';
  constructor() { }
}
