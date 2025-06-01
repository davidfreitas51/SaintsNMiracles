namespace Core.Models;

public class Saint
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Country { get; set; }
    public required int Century { get; set; }
    public required string Image { get; set; }
    public required string Description { get; set; }
}
