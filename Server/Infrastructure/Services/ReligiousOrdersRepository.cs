using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class ReligiousOrdersRepository(DataContext context) : IReligiousOrdersRepository
{
    public async Task<PagedResult<ReligiousOrder>> GetAllAsync(EntityFilters filters)
    {
        var query = context.ReligiousOrders.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            query = query.Where(ro => ro.Name.Contains(filters.Search));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(ro => ro.Name)
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResult<ReligiousOrder>
        {
            Items = items,
            TotalCount = total
        };
    }

    public async Task<ReligiousOrder?> GetByIdAsync(int id)
    {
        return await context.ReligiousOrders.FindAsync(id);
    }

    public async Task<bool> CreateAsync(ReligiousOrder order)
    {
        context.ReligiousOrders.Add(order);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(ReligiousOrder order)
    {
        context.ReligiousOrders.Update(order);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task DeleteAsync(int id)
    {
        var order = await context.ReligiousOrders.FindAsync(id);
        if (order is not null)
        {
            context.ReligiousOrders.Remove(order);
            await context.SaveChangesAsync();
        }
    }
}
