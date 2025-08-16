using Core.DTOs;

namespace Core.Interfaces.Services;

public interface IPrayersService
{
    Task<int?> CreatePrayerAsync(NewPrayerDto newPrayer);
    Task<bool> UpdatePrayerAsync(int id, NewPrayerDto updatedPrayer);
    Task DeletePrayerAsync(string slug);
}