namespace Core.Models;

public class MiracleFilters
{
    public string OrderBy { get; set; } = "";
    public string Country { get; set; } = "";
    public string Century { get; set; } = "";
    public string Search { get; set; } = "";

    // Novos filtros opcionais
    public string Date { get; set; } = ""; // pode ser mês, ano, ou data completa conforme necessidade
    public string Location { get; set; } = "";
    public int? SaintId { get; set; }
    public List<int>? TagIds { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}
