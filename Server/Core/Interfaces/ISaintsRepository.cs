using Core.Models;

namespace Core.Interfaces;

public interface ISaintsRepository
{
    Task<PagedResult<Saint>> GetAllAsync(SaintFilters filters);
    Task<Saint?> GetByIdAsync(int id);
    Task<Saint?> GetBySlugAsync(string slug);
    Task<bool> CreateSaintAsync(Saint saint);
    Task<bool> UpdateSaintAsync(Saint saint);
    Task DeleteSaintAsync(int id);
    Task<IReadOnlyList<string>> GetCountriesAsync();
    Task<int> GetTotalSaintsAsync();
}
