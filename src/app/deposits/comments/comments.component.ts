import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import { CommentDTO, UserPrivateDTO } from '../../model/api';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  @Input() comments: CommentDTO[] = [];
  @Input() canModerate = false;
  @Input() profile?: UserPrivateDTO;
  commentForm: FormGroup;

  @Output() newComment: EventEmitter<string> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.commentForm = this.formBuilder.group({
      content: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
    });
  }

  addComment(): void {
    const content = this.commentForm.get('content')?.value;
    this.newComment.emit(content);
    this.reset();
  }

  deleteComment(commentId: string): void {
    this.delete.emit(commentId);
  }

  reset(): void {
    this.commentForm.reset();
  }
}
