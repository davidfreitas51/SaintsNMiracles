using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;

public class NewMiracleDto
{
    [RegularExpression(@"^(?=.*[A-Za-z]).+$", ErrorMessage = "Title cannot be only numbers.")]
    public string Title { get; set; } = default!;
    public string Country { get; set; } = default!;
    public int Century { get; set; }
    public string Image { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string MarkdownContent { get; set; } = default!;

    public DateOnly? Date { get; set; }
    public string? Location { get; set; }
    public int? SaintId { get; set; }
    public List<int> TagIds { get; set; } = [];
}
