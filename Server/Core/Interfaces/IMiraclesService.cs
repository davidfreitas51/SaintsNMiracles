using Core.DTOs;

namespace Core.Interfaces;

public interface IMiraclesService
{
    Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewMiracleDto newMiracle, string slug);
    Task DeleteFilesAsync(string slug);
    Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewMiracleDto updatedMiracle, string slug);
}
