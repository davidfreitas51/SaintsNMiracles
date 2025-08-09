using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class TagsRepository(DataContext context) : ITagsRepository
{
    public async Task<PagedResult<Tag>> GetAllAsync(EntityFilters filters)
    {
        var query = context.Tags.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            query = query.Where(t => t.Name.Contains(filters.Search));
        }

        if (filters.Type.HasValue)
        {
            var tagTypeEnum = (TagType)filters.Type.Value;
            query = query.Where(t => t.TagType == tagTypeEnum);
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


    public async Task<List<Tag>> GetByIdsAsync(List<int> ids)
    {
        return await context.Tags.Where(t => ids.Contains(t.Id)).ToListAsync();
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

    public async Task<Tag?> GetByIdAsync(int id)
    {
        return await context.Tags.FindAsync(id);
    }
}
