import { Component, OnInit, OnDestroy } from '@angular/core';
import { postsService } from '../posts/post.service';
import { Subscription } from 'rxjs';
import { authService } from '../auth/auth.Service';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css']
})
export class headerComponent implements OnInit, OnDestroy{

     badgeValue = 0;
     userAuthenticated: boolean = false;
     private authSub: Subscription;
     private postSub: Subscription;

    constructor( public postsService: postsService, public authService: authService){}

    ngOnInit(){
        this.userAuthenticated = this.authService.getIsAuth()
        this.postSub =  this.postsService.updatedPostListner()
        .subscribe((posts) => {
           this.badgeValue = posts.totalPost
        }) 

        this.authSub = this.authService.getUserTokenListner().subscribe(
            (isAuthenticated) => {
                this.userAuthenticated = isAuthenticated
            }
        )
        
    }

    onLogout(){
        this.authService.logout()
    }

    ngOnDestroy(){
        this.postSub.unsubscribe()
        this.authSub.unsubscribe()
    }
    
}