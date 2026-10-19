import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { appConfig } from './app.config';

describe('Social post comments', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [...(appConfig.providers ?? []), provideHttpClientTesting()] }).compileComponents();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('loads saved comments with the fixed author name', () => {
    const { fixture, root, http } = createPage();
    http.expectOne('/api/comments').flush([{ id: 3, authorName: 'Blend 285', text: 'Small steps count.', createdAtUtc: '2026-10-20T00:00:00Z' }]);
    fixture.detectChanges();

    expect(root.querySelector('[data-comment-id="3"]')?.textContent).toContain('Small steps count.');
    expect(root.querySelector('[data-comment-id="3"] .comment-author')?.textContent?.trim()).toBe('Blend 285');
  });

  it('posts on Enter and displays the saved comment below the post', () => {
    const { fixture, root, http } = createPage();
    http.expectOne('/api/comments').flush([]);
    fixture.detectChanges();
    const input = setComment(root, 'Change can start with one good decision.');
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    const request = http.expectOne('/api/comments');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ text: 'Change can start with one good decision.' });
    request.flush({ id: 8, authorName: 'Blend 285', text: 'Change can start with one good decision.', createdAtUtc: '2026-10-20T00:05:00Z' });
    fixture.detectChanges();

    expect(root.querySelector('[data-comment-id="8"]')?.textContent).toContain('Change can start with one good decision.');
    expect(root.querySelector('#comment-input') instanceof HTMLTextAreaElement).toBe(true);
    expect((root.querySelector('#comment-input') as HTMLTextAreaElement).value).toBe('');
  });

  it('does not submit an empty or whitespace only comment', () => {
    const { fixture, root, http } = createPage();
    http.expectOne('/api/comments').flush([]);
    fixture.detectChanges();
    const input = setComment(root, '   ');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(http.match('/api/comments').filter((request) => request.request.method === 'POST')).toHaveLength(0);
    expect(root.textContent).toContain('Write a comment before posting.');
  });
});

function createPage(): { fixture: ReturnType<typeof TestBed.createComponent<App>>; root: HTMLElement; http: HttpTestingController } {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  return { fixture, root: fixture.nativeElement as HTMLElement, http: TestBed.inject(HttpTestingController) };
}

function setComment(root: HTMLElement, value: string): HTMLTextAreaElement {
  const input = root.querySelector<HTMLTextAreaElement>('#comment-input');
  if (!input) throw new Error('Comment input was not rendered.');
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return input;
}
