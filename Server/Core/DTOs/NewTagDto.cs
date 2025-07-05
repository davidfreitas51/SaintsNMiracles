using Core.Enums;

namespace Core.DTOs;

public class NewTagDto
{
    public string Name { get; set; } = string.Empty;
    public required TagType TagType { get; set; }
}
