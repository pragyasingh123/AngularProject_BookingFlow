import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  
  constructor(private httpClient: HttpClient) { }
  
  
  public HttpPostRequest(requestModel: any, apiServicePath: string){
    return this.httpClient.post( environment.apiUrl + apiServicePath,JSON.stringify(requestModel));
  }
  public HttpPutRequest(requestModel: any, apiServicePath: string){
    return this.httpClient.put( environment.apiUrl + apiServicePath,JSON.stringify(requestModel));
  }

  public HttpGetRequest(apiServicePath: string){
    return this.httpClient.get( environment.apiUrl + apiServicePath);
  }



}
