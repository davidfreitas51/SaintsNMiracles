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

    public Task<Saint> GetSaintById(int id)
    {
        throw new NotImplementedException();
    }
}
