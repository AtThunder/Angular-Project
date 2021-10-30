import { Post } from "./post.model";
import { Injectable } from '@angular/core';

// keeps this.posts updated
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiURL + '/posts';

// to use this class as a SERVICE
@Injectable({providedIn: 'root'})
export class postsService{
    
    private post: Post[] =[];
    private storedPost = new Subject< {post: Post[], totalPost: number} >();

    constructor(private http : HttpClient, public router: Router){}

    updatedPostListner(){
        return this.storedPost.asObservable()
    }
    
    addPost(title: string, content: string, image: File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title)

        this.http
            .post<{message: string, savedpost: Post}>(
            BACKEND_URL , postData
            )
        .subscribe((response) => {
            console.log(response.message)
            // this.post.push(response.savedpost)           ...not needed as we navigate to message page & there gePost will update the posts.
            // this.storedPost.next({post: [...this.post], totalPost: 4})
            this.router.navigate([''])
        })
    }

    
    getPost(pagesize: number, currentpage: number){
        const pageQuery = `?pagesize=${pagesize}&currentpage=${currentpage}`

        this.http
            .get<{message: string, posts: Post[], totalPost: number}>
        (BACKEND_URL  + pageQuery)
        .subscribe( (response) => {
            this.post = response.posts;
            console.log(this.post)
            this.storedPost.next({post: [...this.post], totalPost: response.totalPost})
        } )
    }
    
    fetchPost(id: string){
        
        return this.http.get<Post>(BACKEND_URL + '/' + id);

    }

    updatePost(id: string, title: string, creator: string, content: string, image: File | string){
        let formData: FormData | Post
        if(typeof image != 'string' ){
             formData = new FormData();
            formData.append('_id', id);
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', image, title);
            formData.append('creator', creator);
            
        }else{
            formData = {
                _id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: creator
            }
        }
        this.http.put(BACKEND_URL + '/' + id, formData)
        .subscribe( response => {
            console.log(response)
            this.router.navigate(['/'])
        })
    }

    deletePost(postId){
      return  this.http.delete<{message: string}>(BACKEND_URL + '/' + postId)

    }
}