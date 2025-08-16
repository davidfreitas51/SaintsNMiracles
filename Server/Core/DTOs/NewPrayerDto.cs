namespace Core.DTOs;

public class NewPrayerDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }

    public string? Image { get; set; }

    public required string MarkdownContent { get; set; }

    public List<int>? TagIds { get; set; }
}
