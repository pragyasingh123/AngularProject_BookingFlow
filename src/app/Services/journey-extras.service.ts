import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApireferenceService } from '../utility/apireference.service';
import { HttpClientService } from '../utility/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class JourneyExtrasService {

  constructor(private httpClientService: HttpClientService, private apiPath: ApireferenceService) { }

  getEvaluateJourney(evaluateJourneyRequest: any) {
    return this.httpClientService.HttpPostRequest(evaluateJourneyRequest, this.apiPath.evaluateJourneyDetails);
  }

  saveJourneyForLater(saveJourneyRequest: any){
    return this.httpClientService.HttpPostRequest(saveJourneyRequest, this.apiPath.journeySaved);
  }
}
