import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { authService } from './auth.Service';

@Injectable()
export class authGuard implements CanActivate {
  constructor(private authService: authService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    const IsAuth = this.authService.getIsAuth();
    if(!IsAuth){
        this.router.navigate(['auth/login'])
    }
    return IsAuth;
  }
}
