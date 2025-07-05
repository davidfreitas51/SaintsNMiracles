using System.ComponentModel.DataAnnotations;

public class NewSaintDto
{
    [Required]
    public string Name { get; set; } = default!;

    [Required]
    public string Country { get; set; } = default!;

    [Range(1, 21)]
    public int Century { get; set; }

    [Required]
    public string Image { get; set; } = default!;

    [Required]
    public string Description { get; set; } = default!;

    [Required]
    public string MarkdownContent { get; set; } = default!;

    public string? Title { get; set; }

    public DateOnly? FeastDay { get; set; }

    public string? PatronOf { get; set; }

    public int? ReligiousOrderId { get; set; }

    [MaxLength(5)]
    public List<int>? TagIds { get; set; }

    public string? Slug { get; set; }
}
