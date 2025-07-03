using Core.Interfaces;
using Core.Models;

namespace Infrastructure.Data.Services;

public class MiraclesRepository : IMiraclesRepository
{
    public Task<bool> CreateAsync(Miracle miracle)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<PagedResult<Miracle>> GetAllAsync(SaintFilters filters)
    {
        throw new NotImplementedException();
    }

    public Task<Miracle?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<Miracle?> GetBySlugAsync(string slug)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<string>> GetCountriesAsync()
    {
        throw new NotImplementedException();
    }

    public Task<int> GetTotalAsync()
    {
        throw new NotImplementedException();
    }

    public Task<bool> SlugExistsAsync(string slug)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateAsync(Miracle miracle)
    {
        throw new NotImplementedException();
    }
}
