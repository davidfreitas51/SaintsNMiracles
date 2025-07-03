namespace Core.Models;

public class Miracle
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Country { get; set; }
    public required int Century { get; set; }
    public required string Image { get; set; }
    public required string Description { get; set; }
    public required string MarkdownPath { get; set; }
    public required string Slug { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
