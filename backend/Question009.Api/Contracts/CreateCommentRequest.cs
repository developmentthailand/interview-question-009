using System.ComponentModel.DataAnnotations;

namespace Example.Com.InterviewQuestion009.Contracts;

public sealed record CreateCommentRequest([param: Required, StringLength(1000, MinimumLength = 1)] string? Text);
