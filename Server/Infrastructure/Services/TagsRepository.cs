using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class TagsRepository(DataContext context) : ITagsRepository
{
    public async Task<PagedResult<Tag>> GetAllAsync(TagFilters filters)
    {
        var query = context.Tags.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            query = query.Where(t => t.Name.Contains(filters.Search));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(t => t.Name)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResult<Tag>
        {
            Items = items,
            TotalCount = total
        };
    }

    public async Task<Tag?> GetByIdAsync(int id)
    {
        return await context.Tags.FindAsync(id);
    }

    public async Task<bool> CreateAsync(Tag tag)
    {
        context.Tags.Add(tag);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(Tag tag)
    {
        context.Tags.Update(tag);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task DeleteAsync(int id)
    {
        var tag = await context.Tags.FindAsync(id);
        if (tag is not null)
        {
            context.Tags.Remove(tag);
            await context.SaveChangesAsync();
        }
    }
}
