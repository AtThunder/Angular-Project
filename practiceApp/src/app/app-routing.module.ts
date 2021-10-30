import { NgModule } from '@angular/core';
 import { Routes, RouterModule } from '@angular/router';
import { postListComponent } from './posts/post-list/postList.component';
import { PostCreateComponent } from './posts/post-create/postCreate.component';

import { authGuard } from './auth/authGuard';

const routes: Routes =  [
    {path: '', component: postListComponent},
    {path: 'create', component: PostCreateComponent, canActivate: [authGuard]},
    {path: 'edit/:postId', component: PostCreateComponent, canActivate: [authGuard]},
    {path: 'auth', loadChildren: () => import('./auth/authRouting.module').then(m => m.authRouting)}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [authGuard]
})
export class appRoutingModule{}