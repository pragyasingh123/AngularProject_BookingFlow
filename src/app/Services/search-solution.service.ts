import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApireferenceService } from '../utility/apireference.service';
import { HttpClientService } from '../utility/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SearchSolutionService {
  constructor(private httpClientService: HttpClientService, private apiPath: ApireferenceService) {}

  getSolutions(searchRequestModel:any) {
    return this.httpClientService.HttpPostRequest(searchRequestModel, this.apiPath.journeyDetail);
  }
  
  getRouteDetails(routeDetailsRequest:any) {
    return this.httpClientService.HttpGetRequest(this.apiPath.routedetail+"?" + "uid=" + routeDetailsRequest.TravelSolutionServiceId + "&enquiryid=" + routeDetailsRequest.TravelSolutionId + "&sessionid=" + routeDetailsRequest.TravelSolutionCode) ;
  }
  GetJourneyExtendedSolution(JourneyExtendAPIHeader : string)
  {
    return this.httpClientService.HttpGetRequest(this.apiPath.journeyextend + JourneyExtendAPIHeader);
  }
}
