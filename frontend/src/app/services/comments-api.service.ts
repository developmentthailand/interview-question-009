import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SocialComment {
  id: number;
  authorName: string;
  text: string;
  createdAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<SocialComment[]> {
    return this.http.get<SocialComment[]>('/api/comments');
  }

  create(text: string): Observable<SocialComment> {
    return this.http.post<SocialComment>('/api/comments', { text });
  }
}
