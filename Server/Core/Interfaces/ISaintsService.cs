using Core.DTOs;

namespace Core.Interfaces;

public interface ISaintsService
{
    Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewSaintDto newSaint, string slug);
    Task DeleteFilesAsync(string slug);
    Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewSaintDto updatedSaint, string slug);
}

