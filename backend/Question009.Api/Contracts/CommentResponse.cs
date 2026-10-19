namespace Example.Com.InterviewQuestion009.Contracts;

public sealed record CommentResponse(int Id, string AuthorName, string Text, DateTimeOffset CreatedAtUtc);
