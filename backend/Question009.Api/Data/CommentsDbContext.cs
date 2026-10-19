using Example.Com.InterviewQuestion009.Entities;
using Microsoft.EntityFrameworkCore;

namespace Example.Com.InterviewQuestion009.Data;

public sealed class CommentsDbContext(DbContextOptions<CommentsDbContext> options) : DbContext(options)
{
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comment>().ToTable("Comments").HasKey(comment => comment.Id);
        modelBuilder.Entity<Comment>().Property(comment => comment.AuthorName).HasMaxLength(60).IsRequired();
        modelBuilder.Entity<Comment>().Property(comment => comment.Text).HasMaxLength(1000).IsRequired();
        modelBuilder.Entity<Comment>().HasIndex(comment => comment.CreatedAtUtc);
    }
}
