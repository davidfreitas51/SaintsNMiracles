using Core.Models;

namespace Core.Interfaces;

public interface ISaintsRepository
{
    Task<IEnumerable<Saint>> GetAll();
    Task<Saint?> GetById(int id);
    Task<Saint?> GetBySlug(string slug);
    Task<bool> CreateSaint(Saint saint);
    Task DeleteSaint(int id);
}
