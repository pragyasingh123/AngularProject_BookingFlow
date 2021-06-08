import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from 'src/app/Services/shared.service';
import { ApireferenceService } from '../apireference.service';
import { environment } from 'src/environments/environment.prod';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  
  constructor(public spinnerService: NgxSpinnerService, private sharedService: SharedService, private apiPath: ApireferenceService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.sharedService.loaderMessage = null;
    if (req.url.includes(this.apiPath.journeyDetail) || req.url.includes(this.apiPath.journeyextend)) {
      this.sharedService.loaderMessage = "Please wait, we are loading times and fares.";
    }
    else if(req.url.includes(this.apiPath.routedetail)){
        this.sharedService.loaderMessage = "Please wait, we are loading Route Details.";
      }
    else if(req.url.includes(this.apiPath.customerLogin)){
      this.sharedService.loaderMessage = "Login In Process";
    }
    else if(req.url.includes(this.apiPath.getReviewAndBuyDetails)){
      this.sharedService.loaderMessage = "Please wait, we are loading Basket Details";
    }
    return next.handle(req);
 
  }
}
