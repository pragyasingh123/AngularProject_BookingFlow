export class DeliveryMode{
    TotalPrice:string;
    Currency:string;
    DeliveryCache :string;
    DeliveryMode: DeliveryOption[];
   
    // CollectFromStation: LocationMasterData[];
    //
}

export class DeliveryModeRequest {
    DeliveryCache :string;
    DeliveryMode: string;
    DeliveryType: string;
    CollectStationId: number;
    ReservationCache:string;
    UserEmail:string;
    PreviousCache:string;
    IsSeason:boolean;
    
  
    // Address: Address;
    Name: string;
    Surname: string;
    Title: string;
  }
  
  export class DeliveryModeResponse {
     id :Number;
    description:string;
    displayName:string;
    postageFeesApply:Boolean;
    goldCardfare:Boolean;
    price:Number;
    fulfilmentTypeName:string;
    fulfilmentType:string;
  }
    export class DeliveryOption {
    DeliveryMode: string;
    Price: number;
    Currency:string;
    IsHide: boolean;
    id :number=0;
    description:string;
    displayName:string;
  }
  