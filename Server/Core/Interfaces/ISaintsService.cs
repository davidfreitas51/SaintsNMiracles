using Core.DTOs;
using Core.Models;

namespace Core.Interfaces;

public interface ISaintsService
{
    Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewSaintDto newSaint, string slug);
    Task DeleteFilesAsync(string slug);
}

