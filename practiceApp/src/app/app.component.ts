import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { authService } from './auth/auth.Service';
import { authInterceptor } from './auth/authInterceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private authService: authService){}

  ngOnInit(){
    this.authService.autoAuth();      
  }

}
