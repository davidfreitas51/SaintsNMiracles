namespace Core.DTOs;

public class NewSaintDTO
{
    public string Name { get; set; } = default!;
    public string Country { get; set; } = default!;
    public int Century { get; set; }
    public string Image { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string MarkdownContent { get; set; } = default!;
}
