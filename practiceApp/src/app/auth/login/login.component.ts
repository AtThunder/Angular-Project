import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from '../auth.Service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class loginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  private authSub: Subscription;

  constructor(public authService: authService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });

    this.authSub = this.authService.getUserTokenListner().subscribe((authStatus) => {
        this.isLoading = false
    });
  }

  onLogin() {
    this.isLoading = true;
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value.email, this.form.value.password);
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  ngOnDestroy(){
    this.authSub.unsubscribe()
  }
}
