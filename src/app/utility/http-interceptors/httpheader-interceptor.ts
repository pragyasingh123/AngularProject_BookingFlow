import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
     // req = req.clone({ params: req.params.set("", "")});

        return next.handle(req);
  }
}
