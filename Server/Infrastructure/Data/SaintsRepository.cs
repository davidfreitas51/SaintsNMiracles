using System.Globalization;
using System.Text;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SaintsRepository(DataContext context) : ISaintsRepository
{
    public async Task<IEnumerable<Saint>> GetAllAsync(SaintFilters filters)
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
        if (string.IsNullOrWhiteSpace(filters.OrderBy))
        {
            query = query.OrderBy(s => s.Name);
        }
        else
        {
            query = filters.OrderBy.ToLower() switch
            {
                "name" => query.OrderBy(s => s.Name),
                "name_desc" => query.OrderByDescending(s => s.Name),
                "century" => query.OrderBy(s => s.Century),
                "century_desc" => query.OrderByDescending(s => s.Century),
                _ => query.OrderBy(s => s.Name)
            };
        }

        var result = await query.ToListAsync();

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var search = Normalize(filters.Search);

            result = result.Where(s =>
                Normalize(s.Name).Contains(search) ||
                Normalize(s.Description).Contains(search))
                .ToList();
        }

        return result;
    }

    public async Task<bool> CreateSaintAsync(Saint newSaint)
    {
        await context.Saints.AddAsync(newSaint);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task DeleteSaintAsync(int id)
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

    private static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return "";

        var normalized = input.Normalize(NormalizationForm.FormD);
        var chars = normalized
            .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            .ToArray();

        return new string(chars).ToLowerInvariant();
    }
}