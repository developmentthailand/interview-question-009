using Example.Com.InterviewQuestion009.Contracts;
using Example.Com.InterviewQuestion009.Data;
using Example.Com.InterviewQuestion009.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Example.Com.InterviewQuestion009.Controllers;

[ApiController]
[Route("api/comments")]
public sealed class CommentsController(CommentsDbContext database) : ControllerBase
{
    private const string AuthorName = "Blend 285";

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CommentResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var comments = await database.Comments.AsNoTracking().OrderBy(comment => comment.Id)
            .Select(comment => new CommentResponse(comment.Id, comment.AuthorName, comment.Text, comment.CreatedAtUtc))
            .ToListAsync(cancellationToken);
        return Ok(comments);
    }

    [HttpPost]
    [ProducesResponseType<CommentResponse>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateCommentRequest request, CancellationToken cancellationToken)
    {
        var text = request.Text?.Trim();
        if (string.IsNullOrWhiteSpace(text)) return BadRequest(new ProblemDetails { Title = "Comment text is required." });

        var comment = new Comment { AuthorName = AuthorName, Text = text, CreatedAtUtc = DateTimeOffset.UtcNow };
        database.Comments.Add(comment);
        await database.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = comment.Id }, ToResponse(comment));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CommentResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var comment = await database.Comments.AsNoTracking().SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        return comment is null ? NotFound() : Ok(ToResponse(comment));
    }

    private static CommentResponse ToResponse(Comment comment) =>
        new(comment.Id, comment.AuthorName, comment.Text, comment.CreatedAtUtc);
}
