import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { postsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validators';

@Component({
  selector: 'app-post-create',
  templateUrl: './postCreate.component.html',
  styleUrls: ['./postCreate.component.css'],
})
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(
    public postsService: postsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required], mimeType),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.fetchPost(this.postId).subscribe((response) => {
          this.isLoading = false;
          console.log(response);
          this.post = {
            _id: response._id,
            title: response.title,
            content: response.content,
            imagePath: response.imagePath,
            creator: response.creator,
          };
          this.imagePreview = response.imagePath;
          this.form.setValue({
            title: response.title,
            content: response.content,
            image: this.imagePreview,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onPickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    if (this.mode == 'edit') {
      console.log(file);
    }
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.post.creator,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  get content() {
    return this.form.get('content');
  }

  get title() {
    return this.form.get('title');
  }

  get image() {
    return this.form.get('image');
  }
}
