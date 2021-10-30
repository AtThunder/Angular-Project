import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/postCreate.component';
import { headerComponent } from './header/header.component';
import { postListComponent } from './posts/post-list/postList.component';
import { appRoutingModule } from './app-routing.module';
import { loginComponent } from './auth/login/login.component';
import { signupComponent } from './auth/signUp/signup.component';
import { authInterceptor } from './auth/authInterceptor';
import { errorInterceptor } from './error.interseptor';
import { errorComponent } from './error/error.component';
import { angularMaterialModule } from './angularMaterial.module';
import { authRouting } from './auth/authRouting.module';

@NgModule({
  declarations: [
    AppComponent,
    headerComponent,
    PostCreateComponent,
    postListComponent,
    loginComponent,
    signupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    appRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    angularMaterialModule,
    authRouting
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: errorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [errorComponent],
})
export class AppModule {}
