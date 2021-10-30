import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiURL + '/user';

@Injectable({ providedIn: 'root' })
export class authService {
  isAuthenticated;
  userId: string;
  private token: string;
  private TokenExpired: any;
  private userTokenListner = new Subject<boolean>();

  constructor(public http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getUserTokenListner() {
    return this.userTokenListner.asObservable();
  }

  autoAuth() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration) {
      return;
    }
    const expireIn = new Date(expiration);
    const InFuture = expireIn.getTime() - Date.now();
    if (InFuture > 0) {
      this.token = token;
      this.isAuthenticated = true;
      this.setTimer(InFuture / 1000);
      this.userTokenListner.next(true);
    }
  }

  private setTimer(time: number) {
    setTimeout(() => {
      this.logout();
    }, time * 1000);
  }

  addUser(email: string, password: string) {
    const userData: Auth = { email: email, password: password };
    this.http
      .post<{ message: string; userData: Object }>(
        BACKEND_URL + '/signup',
        userData
      )
      .subscribe((response) => {
        console.log(response.message, '  ', response.userData);
        this.router.navigate(['/auth/login'])
      }, error => {
        this.userTokenListner.next(false)
      });
  }
  login(email: string, password: string) {
    const userData: Auth = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, UserId: string }>(
        BACKEND_URL + '/login',
        userData
      )
      .subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.userTokenListner.next(true);
          const tokenExpires = response.expiresIn;
          this.userId = response.UserId
          const dateToken = new Date(Date.now() + tokenExpires * 1000);
          console.log(dateToken);
          this.TokenExpired = this.setTimer(tokenExpires);
          this.saveAuth(this.token, dateToken, this.userId);
          this.router.navigate(['']);
        }
      }, error => {
        this.userTokenListner.next(false)
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.userTokenListner.next(false);
    clearTimeout(this.TokenExpired);
    this.clearAuth();
    this.router.navigate(['']);
  }

  private saveAuth(token: string, expiration: Date, UserId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
    localStorage.setItem('UserId', UserId)
  }

  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('UserId')
  }
}
