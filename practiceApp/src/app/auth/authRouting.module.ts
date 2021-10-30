import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loginComponent } from './login/login.component';
import { signupComponent } from './signUp/signup.component';

const routes: Routes =[
    {path: 'login', component: loginComponent},
    {path: 'signup', component: signupComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class authRouting {}