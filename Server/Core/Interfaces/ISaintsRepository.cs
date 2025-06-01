using Core.Models;

namespace Core.Interfaces;

public interface ISaintsRepository
{
    Task<IEnumerable<Saint>> GetAll();
    Task<Saint> GetSaintById(int id);
}
