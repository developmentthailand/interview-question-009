using Example.Com.InterviewQuestion009.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddDbContext<CommentsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Comments") ?? "Data Source=comments.db"));
builder.Services.AddOpenApi();

var app = builder.Build();
await using (var scope = app.Services.CreateAsyncScope())
{
    var database = scope.ServiceProvider.GetRequiredService<CommentsDbContext>();
    await database.Database.EnsureCreatedAsync();
}

if (app.Environment.IsDevelopment()) app.MapOpenApi();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { }
