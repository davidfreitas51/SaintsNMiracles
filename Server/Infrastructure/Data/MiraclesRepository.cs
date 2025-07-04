using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class MiraclesRepository(DataContext context) : IMiraclesRepository
{
    public async Task<PagedResult<Miracle>> GetAllAsync(MiracleFilters filters)
    {
        var query = context.Miracles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Country))
        {
            query = query.Where(m => m.Country == filters.Country);
        }

        if (!string.IsNullOrWhiteSpace(filters.Century))
        {
            query = query.Where(m => m.Century.ToString() == filters.Century);
        }

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var search = filters.Search.ToLower();

            query = query.Where(m =>
                EF.Functions.Like(m.Title.ToLower(), $"%{search}%") ||
                EF.Functions.Like(m.Description.ToLower(), $"%{search}%"));
        }

        query = string.IsNullOrWhiteSpace(filters.OrderBy)
            ? query.OrderBy(m => m.Title)
            : filters.OrderBy.ToLower() switch
            {
                "title" => query.OrderBy(m => m.Title),
                "title_desc" => query.OrderByDescending(m => m.Title),
                "century" => query.OrderBy(m => m.Century),
                "century_desc" => query.OrderByDescending(m => m.Century),
                _ => query.OrderBy(m => m.Title)
            };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filters.PageNumber - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResult<Miracle>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filters.PageNumber,
            PageSize = filters.PageSize
        };
    }

    public async Task<bool> CreateAsync(Miracle newMiracle)
    {
        await context.Miracles.AddAsync(newMiracle);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(Miracle miracle)
    {
        context.Miracles.Update(miracle);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task DeleteAsync(int id)
    {
        var miracle = await GetByIdAsync(id);
        if (miracle is not null)
        {
            context.Miracles.Remove(miracle);
            await context.SaveChangesAsync();
        }
    }

    public async Task<Miracle?> GetBySlugAsync(string slug)
    {
        return await context.Miracles.FirstOrDefaultAsync(m => m.Slug == slug);
    }

    public async Task<Miracle?> GetByIdAsync(int id)
    {
        return await context.Miracles.FindAsync(id);
    }

    public async Task<IReadOnlyList<string>> GetCountriesAsync()
    {
        return await context.Miracles.Select(m => m.Country).Distinct().ToListAsync();
    }

    public async Task<int> GetTotalMiraclesAsync()
    {
        return await context.Miracles.CountAsync();
    }

    public async Task<bool> SlugExistsAsync(string slug)
    {
        return await context.Miracles.AnyAsync(m => m.Slug == slug);
    }
}
