import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem("id_token");

    if (idToken) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + idToken)
      });
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError(
        (httpErrorResponse: HttpErrorResponse, _: Observable<HttpEvent<any>>) => {
          if (httpErrorResponse.status === HttpStatusCode.Unauthorized) {
            this.authService.logout();
          }
          return throwError(httpErrorResponse);
        }
      )
    );
  }
}
