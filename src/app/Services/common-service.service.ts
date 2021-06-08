import { Injectable } from '@angular/core';
import { LocationResponseData } from '../models/locations/location-response-data';
import { Railcard } from '../models/journey/railcards/railcard';
import { ResponseData } from '../models/common/response';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientService } from '../utility/http-client.service';
import { ApireferenceService } from '../utility/apireference.service';
import { RailCardModel } from '../models/journey/railcard.model';
import { shareReplay, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private httpClientService:HttpClientService,private apiPath:ApireferenceService) { }
  public locations: LocationResponseData[];
  public railCards: RailCardModel[];
  responsedata: ResponseData;
  //public railcards:Railcard[];

  public getLocations() {
    return this.httpClientService.HttpGetRequest(this.apiPath.locationList);
  }

  public getRailcards() {
    return this.httpClientService.HttpGetRequest(this.apiPath.railCardLists);
 }
  
  
}
