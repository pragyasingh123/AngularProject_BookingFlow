export class AddNewAddressRequest {
    addressee:string;
    address1:string;
    address2:string;
    address3:string;
    town:string;
    region:string;
    postcode:string;
    countrycode:string;
    addresstype:string;
    sessionid:string;
    isdefault:string;
  
}
export class AddNewAddressResponse extends AddNewAddressRequest {
    addressid:string;
}

