using Core.Models;

namespace Core.Interfaces;

public interface ITagsRepository
{
    Task<PagedResult<Tag>> GetAllAsync(TagFilters filters);
    Task<Tag?> GetByIdAsync(int id);
    Task<bool> CreateAsync(Tag tag);
    Task<bool> UpdateAsync(Tag tag);
    Task DeleteAsync(int id);
}
