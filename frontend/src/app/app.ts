import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CommentsApiService, SocialComment } from './services/comments-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly api = inject(CommentsApiService);

  protected readonly comments = signal<SocialComment[]>([]);
  protected readonly draft = signal('');
  protected readonly loading = signal(true);
  protected readonly posting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadComments();
  }

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
    this.errorMessage.set(null);
  }

  protected submitOnEnter(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    this.addComment();
  }

  protected addComment(): void {
    const text = this.draft().trim();
    if (!text) {
      this.errorMessage.set('Write a comment before posting.');
      return;
    }
    if (this.posting()) return;

    this.errorMessage.set(null);
    this.posting.set(true);
    this.api
      .create(text)
      .pipe(finalize(() => this.posting.set(false)))
      .subscribe({
        next: (comment) => {
          this.comments.update((current) => [...current, comment]);
          this.draft.set('');
        },
        error: () => this.errorMessage.set('Could not post this comment. Please try again.'),
      });
  }

  protected commentTime(comment: SocialComment): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.createdAtUtc));
  }

  private loadComments(): void {
    this.loading.set(true);
    this.api
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (comments) => this.comments.set(comments),
        error: () => this.errorMessage.set('Could not load comments. Refresh to try again.'),
      });
  }
}
