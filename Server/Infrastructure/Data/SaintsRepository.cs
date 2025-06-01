using System.Threading.Tasks;
using Core.DTOs;
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

    public async Task<Saint?> GetById(int id)
    {
        return await context.Saints.FindAsync(id);
    }

    public async Task<bool> CreateSaint(Saint newSaint)
    {
        await context.Saints.AddAsync(newSaint);
        return await context.SaveChangesAsync() > 0;
    }

}
