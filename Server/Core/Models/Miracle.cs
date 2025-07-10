namespace Core.Models;

public class Miracle
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Country { get; set; }
    public required int Century { get; set; }
    public required string Image { get; set; }
    public required string Description { get; set; }
    public required string MarkdownPath { get; set; }
    public required string Slug { get; set; }

    public DateOnly? Date { get; set; }
    public string? LocationDetails { get; set; }

    public int? SaintId { get; set; }
    public Saint? Saint { get; set; }

    public List<Tag> Tags { get; set; } = [];
}
