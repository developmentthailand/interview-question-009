using System.Net;
using System.Net.Http.Json;

namespace Example.Com.InterviewQuestion009.Tests;

public sealed class CommentsApiTests
{
    [Fact]
    public async Task Comment_is_saved_and_always_uses_the_fixed_author()
    {
        using var factory = new CommentsApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsJsonAsync("/api/comments", new { text = "Change can start today.", authorName = "Different User" });
        var created = await response.Content.ReadFromJsonAsync<CommentDto>();
        var comments = await client.GetFromJsonAsync<CommentDto[]>("/api/comments");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(created);
        Assert.Equal("Blend 285", created.AuthorName);
        Assert.NotNull(comments);
        Assert.Contains(comments, comment => comment.Text == "Change can start today." && comment.AuthorName == "Blend 285");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Create_rejects_empty_comment_text(string text)
    {
        using var factory = new CommentsApiFactory();
        using var client = factory.CreateClient();

        using var response = await client.PostAsJsonAsync("/api/comments", new { text });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed record CommentDto(int Id, string AuthorName, string Text, DateTimeOffset CreatedAtUtc);
}
