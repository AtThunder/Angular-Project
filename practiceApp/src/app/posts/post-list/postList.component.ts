import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { postsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { authService } from 'src/app/auth/auth.Service';

@Component({
  selector: 'app-post-list',
  templateUrl: './postList.component.html',
  styleUrls: ['./postList.component.css'],
})

// with implements postListComponent made a contract to run ngOnInit when using postsService
// OnInit is a lifecycle.
export class postListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalLength;
  pageSize;
  currentPage;
  pageSizeOption = [2, 5, 8];
  isLoading = false;
  userAuthenticated = false;
  userId: string;
  private postSub: Subscription;
  private authSub: Subscription;

  //    using the instance of service created by ANGULAR.
  constructor(
    public postsService: postsService,
    private authService: authService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPost(this.pageSizeOption[0], 1);
    this.postSub = this.postsService
    .updatedPostListner()
    .subscribe((postData: { post: Post[]; totalPost: number }) => {
      this.isLoading = false;
      this.posts = postData.post;
      this.totalLength = postData.totalPost;
      this.userId = this.getSavedUserId()
      });
      console.log(this.userId, 'any user')
      this.userAuthenticated = this.authService.getIsAuth()
      this.authSub = this.authService
      .getUserTokenListner()
      .subscribe((isAuthenticated) => {
        console.log(isAuthenticated)
        this.userId = this.authService.getUserId()
        this.userAuthenticated = isAuthenticated
        console.log(this.userId, 'any user by listner')
      });
  }

  getSavedUserId(){
    return localStorage.getItem('UserId')
  }

  Ondelete(postId) {
    console.log(postId);
    this.postsService.deletePost(postId).subscribe((response) => {
      console.log(response.message);
      this.postsService.getPost(this.pageSize, this.currentPage);
    });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData);
    this.pageSize = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPost(this.pageSize, this.currentPage);
  }

  // did it to prevent data leak after this page is destroyed/removed
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authSub.unsubscribe()
  }
}
