import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { errorComponent } from './error/error.component';

@Injectable()
export class errorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog ){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage = 'An unknow error occured.'
        if(error.error.message){
          errorMessage = error.error.message
        }
        this.dialog.open(errorComponent, {data: {message: errorMessage}})
        return throwError(error);
      })
    );
  }
}
