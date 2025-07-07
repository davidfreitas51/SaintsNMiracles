using Core.Models;

public class SaintFilters
{
    public string OrderBy { get; set; } = "";
    public string Country { get; set; } = "";
    public string Century { get; set; } = "";
    public string Search { get; set; } = "";
    public string FeastMonth { get; set; } = "";
    public string ReligiousOrderId { get; set; } = "";
    public List<Tag> TagIds { get; set; } = [];
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}
