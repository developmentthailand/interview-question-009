namespace Example.Com.InterviewQuestion009.Entities;

public sealed class Comment
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = "Blend 285";
    public string Text { get; set; } = string.Empty;
    public DateTimeOffset CreatedAtUtc { get; set; }
}
