import { Injectable } from '@angular/core';
import { HttpClientService } from '../utility/http-client.service';
import { ApireferenceService } from '../utility/apireference.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  constructor(private httpClientService: HttpClientService, private apiPath: ApireferenceService) { }

  checkCustomerLogin(customerLoginRequest :any,sessioncode:any) {
    return this.httpClientService.HttpPostRequest(customerLoginRequest, this.apiPath.customerLogin+"?sessionid="+sessioncode);
  }

  getCustomerInformation(sessioncode :any) {
    return this.httpClientService.HttpGetRequest( this.apiPath.customerDetail+"?sessionCode="+sessioncode);
  }
  

  registerCustomer(customerRegisterRequest :any) {
    return this.httpClientService.HttpPostRequest(customerRegisterRequest, this.apiPath.registerCustomer);
  }

  resetPasswordCustomer(customerResetPasswordRequst:any){
    return this.httpClientService.HttpPostRequest(customerResetPasswordRequst, this.apiPath.changePassword);
  }

  
  forgetResetPassword(customerResetPasswordRequst:any){
    return this.httpClientService.HttpPostRequest(customerResetPasswordRequst, this.apiPath.forgetResetPassword);
  }
  sendEmailToResetPasswordCustomer(customerSendMailRequst:any){
    return this.httpClientService.HttpPostRequest(customerSendMailRequst, this.apiPath.ressetPasswordEmailLinkCustomer);
  }

  addNectarCard(addNectarCardRequest  :any){
    return this.httpClientService.HttpPostRequest(addNectarCardRequest, this.apiPath.nectarcard);
  }

  getSavedJourneys(sessioncode:any){
    return this.httpClientService.HttpGetRequest( this.apiPath.getSavedJourneys+"?sessionCode="+sessioncode);
  }
  addNewAddress(userNewAddress:any){
    return this.httpClientService.HttpPostRequest(userNewAddress, this.apiPath.addressModification);
  }

  updateUserSeatPreferences(seatpreferences : any)
  {
    return this.httpClientService.HttpPostRequest(seatpreferences, this.apiPath.UserSeatPreferences);
  }
  
  getUserAddresses(sessioncode:any){
    return this.httpClientService.HttpGetRequest( this.apiPath.addressModification+"?sessionid="+sessioncode);
  }

  removeUserAddress(userData:any){
    return this.httpClientService.HttpPostRequest(userData, this.apiPath.deleteUserAddress);
  }
}