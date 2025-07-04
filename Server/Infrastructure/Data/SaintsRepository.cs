using System.Globalization;
using System.Text;
using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SaintsRepository(DataContext context) : ISaintsRepository
{
    public async Task<PagedResult<Saint>> GetAllAsync(SaintFilters filters)
    {
        var query = context.Saints.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Country))
        {
            query = query.Where(s => s.Country == filters.Country);
        }

        if (!string.IsNullOrWhiteSpace(filters.Century))
        {
            query = query.Where(s => s.Century.ToString() == filters.Century);
        }

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var search = filters.Search.ToLower();

            query = query.Where(s =>
                EF.Functions.Like(s.Name.ToLower(), $"%{search}%") ||
                EF.Functions.Like(s.Description.ToLower(), $"%{search}%"));
        }

        query = string.IsNullOrWhiteSpace(filters.OrderBy)
            ? query.OrderBy(s => s.Name)
            : filters.OrderBy.ToLower() switch
            {
                "name" => query.OrderBy(s => s.Name),
                "name_desc" => query.OrderByDescending(s => s.Name),
                "century" => query.OrderBy(s => s.Century),
                "century_desc" => query.OrderByDescending(s => s.Century),
                _ => query.OrderBy(s => s.Name)
            };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filters.PageNumber - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResult<Saint>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filters.PageNumber,
            PageSize = filters.PageSize
        };
    }

    public async Task<bool> CreateAsync(Saint newSaint)
    {
        await context.Saints.AddAsync(newSaint);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(Saint saint)
    {
        context.Saints.Update(saint);
        return await context.SaveChangesAsync() > 0;
    }


    public async Task DeleteAsync(int id)
    {
        Saint? saint = await GetByIdAsync(id);
        if (saint is not null)
        {
            context.Remove(saint);
            await context.SaveChangesAsync();
        }
    }
    public async Task<Saint?> GetBySlugAsync(string slug)
    {
        return await context.Saints
            .FirstOrDefaultAsync(s => s.Slug == slug);
    }

    public async Task<Saint?> GetByIdAsync(int id)
    {
        return await context.Saints.FindAsync(id);
    }

    public async Task<IReadOnlyList<string>> GetCountriesAsync()
    {
        return await context.Saints.Select(s => s.Country).Distinct().ToListAsync();
    }

    public async Task<int> GetTotalSaintsAsync()
    {
        return await context.Saints.CountAsync();
    }

    public async Task<bool> SlugExistsAsync(string slug)
    {
        return await context.Saints.AnyAsync(s => s.Slug == slug);
    }
}