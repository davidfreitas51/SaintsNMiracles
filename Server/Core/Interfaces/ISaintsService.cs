using Core.DTOs;

namespace Core.Interfaces;

public interface ISaintsService
{
    Task<(string markdownPath, string? imagePath)> SaveSaintFilesAsync(NewSaintDTO newSaint, string slug);
}

