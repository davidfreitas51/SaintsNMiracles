using Core.Models;

namespace Core.Interfaces;

public interface ISaintsRepository
{
    Task<IEnumerable<Saint>> GetAll();
    Task<Saint?> GetById(int id);
    Task<bool> CreateSaint(Saint saint);
    Task DeleteSaint(int id);
}
