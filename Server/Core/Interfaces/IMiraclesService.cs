using Core.DTOs;

public interface IMiraclesService
{
    Task<int?> CreateMiracleAsync(NewMiracleDto newMiracle);
    Task<bool> UpdateMiracleAsync(int id, NewMiracleDto updatedMiracle);
    Task DeleteFilesAsync(string slug);
    Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewMiracleDto miracleDto, string slug);
    Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewMiracleDto miracleDto, string slug);
}
