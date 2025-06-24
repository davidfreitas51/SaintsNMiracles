using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SaintsRepository(DataContext context) : ISaintsRepository
{
    public async Task<IEnumerable<Saint>> GetAll()
    {
        return await context.Saints.ToListAsync();
    }

    public async Task<bool> CreateSaint(Saint newSaint)
    {
        await context.Saints.AddAsync(newSaint);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task DeleteSaint(int id)
    {
        Saint? saint = await GetById(id);
        if (saint is not null)
        {
            context.Remove(saint);
            await context.SaveChangesAsync();
        }
    }
    public async Task<Saint?> GetBySlug(string slug)
    {
        return await context.Saints
            .FirstOrDefaultAsync(s => s.Slug == slug);
    }

    public async Task<Saint?> GetById(int id)
    {
        return await context.Saints.FindAsync(id);
    }
}
