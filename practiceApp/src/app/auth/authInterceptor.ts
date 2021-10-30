import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authService } from './auth.Service';


@Injectable()
export class authInterceptor implements HttpInterceptor {

    constructor(private authService: authService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const token = this.authService.getToken()
        const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
        })
        return next.handle(authReq)
    }
}