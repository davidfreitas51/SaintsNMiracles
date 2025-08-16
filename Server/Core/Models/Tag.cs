using System.Text.Json.Serialization;
using Core.Enums;

namespace Core.Models;

public class Tag
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required TagType TagType { get; set; }

    [JsonIgnore]
    public List<Saint> Saints { get; set; } = new();

    [JsonIgnore]
    public List<Miracle> Miracles { get; set; } = new();

    [JsonIgnore]
    public List<Prayer> Prayers { get; set; } = []; 
}
