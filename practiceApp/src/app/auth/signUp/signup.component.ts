import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { authService } from 'src/app/auth/auth.Service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class signupComponent implements OnInit, OnDestroy{
    form: FormGroup;
    isLoading = false;
    private authSub: Subscription;

    constructor(public authService: authService){}

    ngOnInit(){
        this.form = new FormGroup({
            'Email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required])
        })
        this.authSub = this.authService.getUserTokenListner().subscribe((authStats) => {
            this.isLoading = false;
        })
    }

    onSignup(){
        this.isLoading = true
        if(this.form.invalid){
            return
        }
        this.authService.addUser(this.form.value.Email, this.form.value.password)
    }

    get Email(){
       return this.form.get('Email')
    }
    get password(){
        return this.form.get('password')
    }

    ngOnDestroy(){
        this.authSub.unsubscribe()
    }
}